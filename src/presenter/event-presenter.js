import {render, replace, remove} from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';
import {isEscEvent} from '../utils/common.js';
import {USER_ACTION, UPDATE_TYPE} from '../constants.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class EventPresenter {
  #eventsListContainer = null;
  #changeData = null;
  #changeMode = null;
  #destinationsCatalog = null;
  #offersCatalog = null;

  #eventComponent = null;
  #eventEditComponent = null;


  #event = null;
  #mode = Mode.DEFAULT;

  constructor(eventsListContainer, changeData, changeMode, destinationsCatalog, offersCatalog) {
    this.#eventsListContainer = eventsListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#destinationsCatalog = destinationsCatalog;
    this.#offersCatalog = offersCatalog;
  }

  init = (event) => {
    this.#event = event;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new EventView(event, this.#offersCatalog);
    this.#eventEditComponent = new EventEditView(this.#destinationsCatalog, this.#offersCatalog, this.#event);


    this.#eventComponent.setFavoriteClickHandler(() => {
      this.#changeData(
        USER_ACTION.UPDATE_EVENT,
        UPDATE_TYPE.PATCH,
        {...this.#event, isFavorite: !this.#event.isFavorite},
      );
    });

    this.#eventComponent.setEditClickHandler(() => {
      this.#replaceEventToForm();
    });

    this.#eventEditComponent.setRollupButtonClickHandler(() => {
      this.#eventEditComponent.reset(this.#event);
      this.#replaceFormToEvent();
    });

    this.#eventEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    this.#eventEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#eventsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventComponent, prevEventEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  };

  destroy = () => {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#eventEditComponent.reset(this.#event);
      this.#replaceFormToEvent();
    }
  };

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#eventEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#eventEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#eventEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#eventEditComponent.shake(resetFormState);
  };


  #replaceEventToForm = () => {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown',  this.#onEventEditKeydown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToEvent = () => {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#onEventEditKeydown);
    this.#mode = Mode.DEFAULT;
  };

  #onEventEditKeydown = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.#eventEditComponent.reset(this.#event);
      this.#replaceFormToEvent();
    }
  };

  #handleFormSubmit = (updatedEvent) => {
    // Проверяем, поменялись ли в задаче данные, которые попадают под фильтрацию,
    // а значит требуют перерисовки списка - если таких нет, это PATCH-обновление
    const isMajorUpdate = this.#event.destination.name !== updatedEvent.destination.name || this.#event.basePrice !== updatedEvent.basePrice || this.#event.dateTo !== updatedEvent.dateTo || this.#event.dateFrom !== updatedEvent.dateFrom || this.#event.type !== updatedEvent.type ;

    this.#changeData(
      USER_ACTION.UPDATE_EVENT,
      isMajorUpdate ? UPDATE_TYPE.MAJOR : UPDATE_TYPE.MINOR,
      updatedEvent,
    );
  };

  #handleDeleteClick = (event) => {
    this.#changeData(
      USER_ACTION.DELETE_EVENT,
      UPDATE_TYPE.MINOR,
      event,
    );
  };
}

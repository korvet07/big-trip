import {remove, render, RenderPosition} from '../framework/render.js';
import EventEditView from '../view/event-edit-view.js';
import {USER_ACTION, UPDATE_TYPE} from '../constants.js';

export default class EventNewPresenter {
  #EventListContainer = null;
  #changeData = null;
  #eventEditComponent = null;
  #destroyCallback = null;
  #destinationsCatalog = null;
  #offersCatalog = null;

  constructor(EventListContainer, changeData, destinationsCatalog, offersCatalog) {
    this.#EventListContainer = EventListContainer;
    this.#changeData = changeData;
    this.#destinationsCatalog = destinationsCatalog;
    this.#offersCatalog = offersCatalog;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#eventEditComponent !== null) {
      return;
    }

    this.#eventEditComponent = new EventEditView(this.#destinationsCatalog, this.#offersCatalog);
    this.#eventEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#eventEditComponent.setDeleteClickHandler(this.#handleDeleteClick);
    this.#eventEditComponent.setRollupButtonClickHandler(this.#handleDeleteClick);

    render(this.#eventEditComponent, this.#EventListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (!this.#eventEditComponent) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#eventEditComponent);
    this.#eventEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving = () => {
    this.#eventEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
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

  #handleFormSubmit = (event) => {
    this.#changeData(
      USER_ACTION.ADD_EVENT,
      UPDATE_TYPE.MAJOR,
      event,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}

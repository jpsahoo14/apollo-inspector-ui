import { addSection } from "./add-section-resolver";
import { setSelectedPageResolver } from "./set-selected-page-resolver";

export const mutation = {
  addSection,
  setSelectedPage: setSelectedPageResolver,
};

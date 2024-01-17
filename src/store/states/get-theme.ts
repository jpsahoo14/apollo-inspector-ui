import { ISet, ITheme } from "../store.interface";
import { createState } from "../create-state";

export const getSelectedApolloClientId = (
  set: ISet
): ITheme => {
  const [theme, setTheme] = createState<
    string
  >("light", "theme", set);

  return {
    theme,
    setTheme,
  };
};

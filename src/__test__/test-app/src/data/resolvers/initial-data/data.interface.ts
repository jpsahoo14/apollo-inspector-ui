export interface ISection {
  id: number;
  title: string;
  content: string;
  lastEditedBy: IUser;
  isEditing: boolean;
}

export interface IUser {
  id: number;
  name: string;
}

export interface IPage {
  id: number;
  title: string;
  sections: ISection[];
  lastEditedBy: IUser;
  lastEditTime?: string;
  isEditing: boolean;
}

export interface IData {
  editorData?: IEditorData;
}

export interface IEditorData {
  id: number;
  selectedPage: IPage;
  pages: IPage[];
}

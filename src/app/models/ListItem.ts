
export abstract class ListItem {
  itemName: string | number;
  id: string;
  extraInfo: string; // could be room type  for (guest rooms) or comments (public area)
  itemObject: object;
  status: boolean;

  abstract getItemName();

  abstract getExtraInfo();

}

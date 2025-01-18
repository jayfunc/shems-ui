export class  Equipment {
  id: number;
  icon: any;
  name: string;
  desc: string;
  area: string;
  usage: string;

  constructor(id: number, icon: any, name: string, desc: string, area: string, usage: string) {
    this.id = id;
    this.icon = icon;
    this.name = name;
    this.desc = desc;
    this.area = area;
    this.usage = usage;
  }
}
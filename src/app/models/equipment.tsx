import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export class Equipment {
  id: number;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  name: string;
  desc: string;
  area: string;
  usage: string;

  constructor(id: number, icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>, name: string, desc: string, area: string, usage: string) {
    this.id = id;
    this.icon = icon;
    this.name = name;
    this.desc = desc;
    this.area = area;
    this.usage = usage;
  }
}
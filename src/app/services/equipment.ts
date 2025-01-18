import { Lightbulb } from "lucide-react";
import { Equipment } from "../models/equipment";
import baseUri, { useMock } from "./base";

function getEquipmentMock(): Equipment[] {
	const equipment: Equipment[] = [];
	for (let i = 0; i < 50; i++) {
		equipment.push({
			id: i,
			icon: Lightbulb,
			name: `Equipment ${i}`,
			desc: `Description of equipment ${i}`,
			area: `Area ${Math.round(Math.random() * 10)}`,
			usage: `${Math.round(Math.random() * 1000)}`,
		});
	}
	return equipment;
}

export default class EquipmentService {
	static async getEquipment(): Promise<Equipment[]> {
		if (useMock) {
			return getEquipmentMock();
		}
		const response = await fetch(baseUri);
		const data = await response.json();
		return data;
	}
}
import Hse from "@/models/hse";
import Appl from "../models/appl";
import HseCnsmp from "../models/hse-cnsmp";
import ApplCnsmp from "@/models/appl-cnsmp";
import CmtyGridAcct from "@/models/cmty-grid-acct";
import HseGen from "@/models/hse-gen";
import LocStor from "@/models/loc-stor";
import MainGridAcct from "@/models/main-grid-acct";
import MainGridCfg from "@/models/main-grid-cfg";
import RmtStor from "@/models/rmt-stor";
import SimCfg from "@/models/sim-cfg";
import HseCnsmpPred from "@/models/hse-cnsmp-pred";
import HseGenPred from "@/models/hse-gen-pred";
import Wx from "@/models/wx";

const baseUri: string = "http://localhost:8080/api";
const gridUri: string = `${baseUri}/grid`;
const hseUri: string = `${baseUri}/hse`;
const simUri: string = `${baseUri}/sim`;
const applUri: string = `${baseUri}/appl`;
const storUri: string = `${baseUri}/stor`;
const wxUri: string = `${baseUri}/wx`;

export default class ApiService {
	// Appl

	static async getAppl(id: number): Promise<ResponseData<Appl>> {
		const response = await fetch(`${applUri}?id=${id}`);
		const data = await response.json();
		return data;
	}

	static async getAllAppls(houseId: number): Promise<ResponseData<Appl[]>> {
		const response = await fetch(`${applUri}/all?houseId=${houseId}`);
		const data = await response.json();
		return data;
	}

	static async getApplCnsmp(id: number): Promise<ResponseData<ApplCnsmp>> {
		const response = await fetch(`${applUri}/cnsmp?id=${id}`);
		const data = await response.json();
		return data;
	}

	// Grid

	static async getCmtyGridAcct(id: number): Promise<ResponseData<CmtyGridAcct>> {
		const response = await fetch(`${gridUri}/cmty?id=${id}`);
		const data = await response.json();
		return data;
	}

	static async getMainGridAcct(id: number): Promise<ResponseData<MainGridAcct>> {
		const response = await fetch(`${gridUri}/main?id=${id}`);
		const data = await response.json();
		return data;
	}

	static async getMainGridCfg(): Promise<ResponseData<MainGridCfg>> {
		const response = await fetch(`${gridUri}/main/cfg`);
		const data = await response.json();
		return data;
	}

	// Hse

	static async getHseCnsmp(id: number): Promise<ResponseData<HseCnsmp>> {
		const response = await fetch(`${hseUri}/cnsmp?id=${id}`);
		const data = await response.json();
		return data;
	}

	static async getHseGen(id: number): Promise<ResponseData<HseGen>> {
		const response = await fetch(`${hseUri}/gen?id=${id}`);
		const data = await response.json();
		return data;
	}

	static async getHseCnsmpPred(id: number): Promise<ResponseData<HseCnsmpPred>> {
		const response = await fetch(`${hseUri}/cnsmp/pred?id=${id}`);
		const data = await response.json();
		return data;
	}

	static async getHseGenPred(id: number): Promise<ResponseData<HseGenPred>> {
		const response = await fetch(`${hseUri}/gen/pred?id=${id}`);
		const data = await response.json();
		return data;
	}

	static async getHse(id: number): Promise<ResponseData<Hse>> {
		const response = await fetch(`${hseUri}?id=${id}`);
		const data = await response.json();
		return data;
	}

	static async getAllHses(): Promise<ResponseData<Hse[]>> {
		const response = await fetch(`${hseUri}/all`);
		const data = await response.json();
		return data;
	}

	// Stor

	static async getLocStor(id: number): Promise<ResponseData<LocStor>> {
		const response = await fetch(`${storUri}/loc?id=${id}`);
		const data = await response.json();
		return data;
	}

	static async getRmtStor(id: number): Promise<ResponseData<RmtStor>> {
		const response = await fetch(`${storUri}/rmt?id=${id}`);
		const data = await response.json();
		return data;
	}

	// Sim

	static async getSimCfg(): Promise<ResponseData<SimCfg>> {
		const response = await fetch(`${simUri}`);
		const data = await response.json();
		return data;
	}

	// Wx

	static async getWx(): Promise<ResponseData<Wx>> {
		const response = await fetch(`${wxUri}`);
		const data = await response.json();
		return data;
	}
}

class ResponseData<T> {
	status: Status;
	data: T;
	currentTime: number;

	constructor(status: Status, data: T, currentTime: number) {
		this.status = status;
		this.data = data;
		this.currentTime = currentTime;
	}
}

class Status {
	code: number;
	msg: string;

	constructor(code: number, msg: string) {
		this.code = code;
		this.msg = msg;
	}
}
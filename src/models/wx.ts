import Base from "./base";

/**
 * Weather Model
 */
export default class Wx extends Base {
	weatherTime: Date;
	temperature: number;
	humidity: number;
	visibility: number;
	apparentTemperature: number;
	pressure: number;
	windSpeed: number;
	cloudCover: number;
	windBearing: number;
	precipIntensity: number;
	dewPoint: number;
	precipProbability: number;

	constructor(
		id: bigint,
		weatherTime: Date,
		temperature: number,
		humidity: number,
		visibility: number,
		apparentTemperature: number,
		pressure: number,
		windSpeed: number,
		cloudCover: number,
		windBearing: number,
		precipIntensity: number,
		dewPoint: number,
		precipProbability: number,
		simulationTime: string,
	) {
		super(id, simulationTime);
		this.weatherTime = weatherTime;
		this.temperature = temperature;
		this.humidity = humidity;
		this.visibility = visibility;
		this.apparentTemperature = apparentTemperature;
		this.pressure = pressure;
		this.windSpeed = windSpeed;
		this.cloudCover = cloudCover;
		this.windBearing = windBearing;
		this.precipIntensity = precipIntensity;
		this.dewPoint = dewPoint;
		this.precipProbability = precipProbability;
		this.simulationTime = simulationTime;
	}
}

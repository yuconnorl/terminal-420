// forecast code https://opendata.cwb.gov.tw/opendatadoc/MFC/D0047.pdf
export const weatherTypes = {
	SunLight: [1],
	CloudSunny: [2, 3],
	Cloud: [4, 5, 6, 7],
	Fog: [24, 25, 26, 27, 28],
	Rain: [8, 9, 10, 11, 12, 13, 14, 19, 20, 29, 30, 31, 32, 38, 39],
	Snow: [23, 37, 42],
	Thunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
};
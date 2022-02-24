import handleError from "../middlewares/error-handler";
import { forwardApi } from "../service";

export const codeToGeo = async (postalCode: string) => {
  const result = await forwardApi.get(
    `?searchVal=${postalCode}&returnGeom=Y&getAddrDetails=Y&pageNum=1`
  );
  if (result.data.results) {
    const geoData = {
      longitude: result.data.results[0].LONGITUDE,
      latitude: result.data.results[0].LATITUDE,
    };
    return geoData;
  }

  return result.data;
};

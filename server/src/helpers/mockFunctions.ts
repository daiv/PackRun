import TrackModel, { Track } from "../models/trackModel";
import { Location } from "../types";
import { runs } from "./mockRunData";
import { transformToGeoApify } from "./tracksFunctions";

const user = 'testUser';
const functions: Function[] = [];
export default functions;
function populateTracks() {
/*   const lineRun1 = [{ value: 20 }, { value: 21 }, { value: 18 }, { value: 23 }, { value: 20 }, { value: 21 }, { value: 19 }, { value: 18 }, { value: 23 }, { value: 24 }, { value: 20 }, { value: 21 }, { value: 20 }, { value: 21 }, { value: 19 }, { value: 24 }, { value: 20 }, { value: 21 }, { value: 18 }, { value: 23 }, { value: 20 }, { value: 21 }, { value: 19 }];
  const lineRun2 = [{ value: 21 }, { value: 23 }, { value: 19 }, { value: 20 }, { value: 18 }, { value: 21 }, { value: 19 }, { value: 19 }, { value: 20 }, { value: 19 }, { value: 21 }, { value: 23 }, { value: 18 }, { value: 21 }, { value: 19 }, { value: 19 }, { value: 21 }, { value: 23 }, { value: 19 }, { value: 20 }, { value: 18 }, { value: 21 }, { value: 19 }];
  const lineRun3 = [{ value: 21 }, { value: 22 }, { value: 18 }, { value: 19 }, { value: 17 }, { value: 22 }, { value: 21 }, { value: 18 }, { value: 19 }, { value: 22 }, { value: 21 }, { value: 22 }, { value: 19 }, { value: 22 }, { value: 21 }, { value: 22 }, { value: 21 }, { value: 22 }, { value: 18 }, { value: 19 }, { value: 17 }, { value: 22 }, { value: 21 }];
  const lineRun4 = [{ value: 18 }, { value: 21 }, { value: 18 }, { value: 20 }, { value: 19 }, { value: 21 }, { value: 20 }, { value: 18 }, { value: 20 }, { value: 19 }, { value: 18 }, { value: 21 }, { value: 19 }, { value: 23 }, { value: 20 }, { value: 19 }, { value: 18 }, { value: 21 }, { value: 18 }, { value: 20 }, { value: 19 }, { value: 21 }, { value: 20 }];

  const mockRuns = [
    { id: '4', date: '22 Mar 2025', time: '13:08', pace: '5:08/km', distance: '2.56km', profile: lineRun4 },
    { id: '3', date: '20 Mar 2025', time: '16:07', pace: '5:00/km', distance: '3.21km', profile: lineRun3 },
    { id: '2', date: '18 Mar 2025', time: '14:11', pace: '4:43/km', distance: '3.00km', profile: lineRun2 },
    { id: '1', date: '15 Mar 2025', time: '39:23', pace: '5:37/km', distance: '7.00km', profile: lineRun1 }
  ]; */
  for (let i = 0; i < runs.length; i++) {
    const track: Track = {
      id: BigInt(i + 1),
      owner: user,
      createdAt: new Date(runs[i][0].timestamp),
      location: runs[i]
    };
    transformToGeoApify(track.location)
      .then(result => {
        console.log('GEO_RESULT', result);
        if (result && result.features) {
          track.distance = result.features[0].properties.distance;
          track.estimatedTime = result.features[0].properties.time;
        }
      })
      .catch(console.log)
      .finally(() => TrackModel.create(track));
  };
}

functions.push(populateTracks);

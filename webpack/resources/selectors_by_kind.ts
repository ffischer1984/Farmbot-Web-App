import { ResourceIndex } from "./interfaces";
import {
  TaggedResource,
  SpecialStatus,
  isTaggedResource,
  sanityCheck,
  TaggedWebcamFeed,
  TaggedFbosConfig,
  TaggedCrop,
  TaggedRegimen,
  TaggedImage,
  TaggedLog,
  TaggedTool,
  TaggedFarmEvent,
  TaggedSequence,
  TaggedPoint,
  TaggedSensor,
  TaggedPeripheral,
  TaggedWebAppConfig,
} from "./tagged_resources";
import { sortResourcesById } from "../util";
import { error } from "farmbot-toastr";
import { assertUuid } from "./selectors";

const isSaved = <T extends TaggedResource>(t: T) => t.specialStatus === SpecialStatus.SAVED;

/** Generalized way to stamp out "finder" functions.
 * Pass in a `ResourceName` and it will add all the relevant checks.
 * WARNING: WILL THROW ERRORS IF RESOURCE NOT FOUND!
 */
const uuidFinder = <T extends TaggedResource>(r: T["kind"]) =>
  function findResource(i: ResourceIndex, u: string): T {
    assertUuid(r, u);
    const result = i.references[u];
    if (result && isTaggedResource(result) && sanityCheck(result)) {
      return result as T;
    } else {
      error("Resource error");
      throw new Error(`Tagged resource ${r} was not found or malformed: ` +
        JSON.stringify(result));
    }
  };

export function findAll<T extends TaggedResource>(index: ResourceIndex, kind: T["kind"]): T[] {
  const results: T[] = [];

  index.byKind[kind].map(function (uuid) {
    const item = index.references[uuid];
    if (item && isTaggedResource(item) && (item.kind === kind)) {
      results.push(item as T);
    }
  });
  return sortResourcesById(results) as T[];
}

export let findTool = uuidFinder<TaggedTool>("Tool");
export let findSequence = uuidFinder<TaggedSequence>("Sequence");
export let findRegimen = uuidFinder<TaggedRegimen>("Regimen");
export let findFarmEvent = uuidFinder<TaggedFarmEvent>("FarmEvent");
export let findPoints = uuidFinder<TaggedPoint>("Point");

export const selectAllCrops = (i: ResourceIndex) => findAll<TaggedCrop>(i, "Crop");
export const selectAllFarmEvents = (i: ResourceIndex) => findAll<TaggedFarmEvent>(i, "FarmEvent");
export const selectAllImages = (i: ResourceIndex) => findAll<TaggedImage>(i, "Image");
export const selectAllLogs = (i: ResourceIndex) => findAll<TaggedLog>(i, "Log");
export const selectAllPeripherals =
  (i: ResourceIndex) => findAll<TaggedPeripheral>(i, "Peripheral");
export const selectAllPoints = (i: ResourceIndex) => findAll<TaggedPoint>(i, "Point");
export const selectAllRegimens = (i: ResourceIndex) => findAll<TaggedRegimen>(i, "Regimen");
export const selectAllSensors = (i: ResourceIndex) => findAll<TaggedSensor>(i, "Sensor");
export const selectAllSequences = (i: ResourceIndex) => findAll<TaggedSequence>(i, "Sequence");
export const selectAllTools = (i: ResourceIndex) => findAll<TaggedTool>(i, "Tool");
export const selectAllSavedSensors =
  (input: ResourceIndex) => selectAllSensors(input).filter(isSaved);
export const selectAllWebcamFeeds =
  (i: ResourceIndex) => findAll<TaggedWebcamFeed>(i, "WebcamFeed");
export const getAllSavedPeripherals =
  (input: ResourceIndex) => selectAllPeripherals(input).filter(isSaved);
export const getFbosConfig =
  (i: ResourceIndex): TaggedFbosConfig | undefined => findAll<TaggedFbosConfig>(i, "FbosConfig")[0];

export const getWebAppConfig = (i: ResourceIndex): TaggedWebAppConfig | undefined => {
  return findAll<TaggedWebAppConfig>(i, "WebAppConfig")[0];
};

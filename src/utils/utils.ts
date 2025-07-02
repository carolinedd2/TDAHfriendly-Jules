/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { StudyItem, StudyItemMeta } from '../types/types';

export interface CompletionStatus {
  completed: number;
  total: number;
}

export const getCompletionStatusRecursive = (
  item: StudyItem,
  comprehendedSet: Set<string>
): CompletionStatus => {
  // Se o item não tem subtópicos (ou a lista está vazia), ele é uma folha.
  if (!item.subtopics || item.subtopics.length === 0) {
    return {
      completed: comprehendedSet.has(item.id) ? 1 : 0,
      total: 1, // Folhas sempre contam como 1 item "finalizável"
    };
  }

  // Se o item tem subtópicos, seu progresso é a soma do progresso dos filhos.
  let totalCompletedLeaves = 0;
  let totalLeaves = 0;
  for (const subItem of item.subtopics) {
    const status = getCompletionStatusRecursive(subItem, comprehendedSet);
    totalCompletedLeaves += status.completed;
    totalLeaves += status.total;
  }

  return { completed: totalCompletedLeaves, total: totalLeaves };
};

export const playSound = (soundUrl: string) => {
  try {
    const audio = new Audio(soundUrl);
    audio.play().catch(e => console.warn("Audio playback failed. User interaction might be required.", e));
  } catch (e) {
    console.warn("Audio element creation failed:", e);
  }
};

export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const addDaysToDateString = (dateString: string, days: number): string => {
  const date = new Date(dateString + 'T00:00:00'); // Ensure it's parsed as local date
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};


export const CHECK_SOUND_URL = 'https://www.soundjay.com/buttons/sounds/button-09.mp3';
export const UNCHECK_SOUND_URL = 'https://www.soundjay.com/buttons/sounds/button-10.mp3';
export const GOAL_COMPLETE_SOUND_URL = 'https://www.soundjay.com/buttons/sounds/button-1.mp3'; // A new sound for goal completion
// Pomodoro end sound: https://www.soundjay.com/buttons/sounds/button-16.mp3


export interface TrailNumberingDetails {
  trailOrderNumberStr: string; // The "1", "2" if trail-relative, or global root number string otherwise
  isTrailRelative: boolean;
  actualRootGlobalId: string; // The global ID of the root topic (e.g., "3")
}

export const getTrailOrderAndRootId = (
  itemGlobalId: string,
  currentTrailId: string | null,
  allTopicsMeta: StudyItemMeta[]
): TrailNumberingDetails => {
  const actualRootGlobalId = itemGlobalId.split('.')[0];
  const rootTopicMeta = allTopicsMeta.find(meta => meta.id === actualRootGlobalId);

  if (currentTrailId && rootTopicMeta && rootTopicMeta.trail === currentTrailId) {
    const topicsInCurrentTrail = allTopicsMeta
      .filter(meta => meta.trail === currentTrailId)
      .sort((a, b) => parseInt(a.id.split('.')[0], 10) - parseInt(b.id.split('.')[0], 10)); // Ensure consistent order

    const indexInTrail = topicsInCurrentTrail.findIndex(meta => meta.id === actualRootGlobalId);

    if (indexInTrail !== -1) {
      return {
        trailOrderNumberStr: (indexInTrail + 1).toString(),
        isTrailRelative: true,
        actualRootGlobalId: actualRootGlobalId,
      };
    }
  }

  // Fallback to global numbering if no trail or item not in trail
  return {
    trailOrderNumberStr: actualRootGlobalId,
    isTrailRelative: false,
    actualRootGlobalId: actualRootGlobalId,
  };
};

export const formatDisplayTitle = (
  originalTitleWithGlobalNum: string,
  trailOrderNumberStr: string, // The "1", "2", etc., for the root within the trail OR the global root number
  isTrailRelative: boolean,
  actualRootGlobalId: string, // Global ID of the root this item belongs to (e.g., "3")
  fullItemGlobalId: string // Full global ID of the item being formatted (e.g., "3.1.1")
): string => {
  const firstSpaceIndex = originalTitleWithGlobalNum.indexOf(' ');
  const textualPart = firstSpaceIndex !== -1 ? originalTitleWithGlobalNum.substring(firstSpaceIndex) : ''; // Includes the leading space if present

  if (isTrailRelative) {
    if (fullItemGlobalId === actualRootGlobalId) { // It's a root topic
      return `${trailOrderNumberStr}.${textualPart.trimStart()}`;
    } else { // It's a subtopic
      // Extract the sub-numbering part like ".1.1" from "3.1.1" if root is "3"
      const subPart = fullItemGlobalId.substring(actualRootGlobalId.length);
      return `${trailOrderNumberStr}${subPart}${textualPart}`;
    }
  }
  
  // If not trail-relative, return the original title.
  // (Could also re-construct using actualRootGlobalId and subPart if needed, but this is simpler)
  return originalTitleWithGlobalNum;
};
import setPastDate from "../../../utils/setPastDate";
import { BodyWeight as BodyWeightType } from "../../../types";

export type BodyWeightFilter =
  | 'lastWeek'
  | 'lastTwoWeeks'
  | 'lastMonth'
  | 'lastTwoMonths'
  | 'customDate'
  | 'all'

type GetVisibleBodyWeightsParams = {
  filter: BodyWeightFilter
  bodyWeights: BodyWeightType[]
  dateFrom: string
  dateTo: string
}

export function getVisibleBodyWeights({ filter, bodyWeights, dateFrom, dateTo }: GetVisibleBodyWeightsParams): BodyWeightType[] {

  const today = new Date().toISOString();
  const lastWeekDate = setPastDate(7);
  const lastTwoWeeksDate = setPastDate(14);
  const lastMonthDate = setPastDate(30);
  const lastTwoMonthsDate = setPastDate(60);

  function getBodyWeightsInRange(bodyWeights: BodyWeightType[], date: string): BodyWeightType[] {
    return bodyWeights.filter((bw) => today >= bw.date && date <= bw.date)
  }

  const lastWeek = getBodyWeightsInRange(bodyWeights, lastWeekDate)
  const lastTwoWeeks = getBodyWeightsInRange(bodyWeights, lastTwoWeeksDate)
  const lastMonth = getBodyWeightsInRange(bodyWeights, lastMonthDate)
  const lastTwoMonths = getBodyWeightsInRange(bodyWeights, lastTwoMonthsDate)
  const customDate = bodyWeights.filter((bw: BodyWeightType) => {
    const bwDate = bw.date.slice(0, 10);
    const from = dateFrom || '0000-01-01';
    const to = dateTo || '9999-12-31';


    return from <= bwDate && to >= bwDate;
  });

  const result =
    filter === 'lastWeek' ? lastWeek :
      filter === 'lastTwoWeeks' ? lastTwoWeeks :
        filter === 'lastMonth' ? lastMonth :
          filter === 'lastTwoMonths' ? lastTwoMonths :
            filter === 'customDate' ? customDate :
              bodyWeights

  return result;

}
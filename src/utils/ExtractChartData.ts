import { IRoutine } from '../interfaces/routine';
import moment, { Moment } from 'moment';

export const extractChartData = (routine: IRoutine, timePeriodDate: Moment) => {
  const finalData = routine.routineData.map(routineDataItem => {
    const filteredProgressData = routineDataItem.progress.filter(progressItem =>
      moment(progressItem.createdAt).isAfter(timePeriodDate)
    );

    const chartData = filteredProgressData.map(item => ({
      label: moment(item.createdAt).format('MM/DD'),
      weight: item.weight
    }));

    return {
      exercise: routineDataItem.exercise,
      progress: chartData
    };
  });

  const chartData = finalData.map(item => {
    return {
      exercise: item.exercise,
      chartData: {
        labels: item.progress.map(iProgress => iProgress.label),
        weight: item.progress.map(iWeight => iWeight.weight)
      }
    };
  });

  return chartData;
};

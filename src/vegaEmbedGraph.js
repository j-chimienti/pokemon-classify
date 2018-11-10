import embed from "vega-embed";

export class UI {

    /**
     * Plot new accuracy values.
     *
     * @param lossValues An `Array` of data to append to.
     * @param epoch Training epoch number.
     * @param newTrainLoss The new training accuracy, as a single `Number`.
     * @param newValidationLoss The new validation accuracy, as a single `Number`.
     */
    static plotAccuracies(
        accuracyValues, epoch, newTrainAccuracy, newValidationAccuracy) {
        accuracyValues.push(
            {epoch, 'accuracy': newTrainAccuracy, 'set': 'train'});
        accuracyValues.push(
            {epoch, 'accuracy': newValidationAccuracy, 'set': 'validation'});
        embed(
            '#accuracyCanvas', {
                '$schema': 'https://vega.github.io/schema/vega-lite/v2.json',
                'data': {'values': accuracyValues},
                'mark': 'line',
                'encoding': {
                    'x': {'field': 'epoch', 'type': 'ordinal'},
                    'y': {'field': 'accuracy', 'type': 'quantitative'},
                    'color': {'field': 'set', 'type': 'nominal'}
                },
                'width': 500
            },
            {});
    }

    static plotLosses(lossValues, epoch, newTrainLoss, newValidationLoss) {
        lossValues.push({epoch, 'loss': newTrainLoss, 'set': 'train'});
        lossValues.push(
            {epoch, 'loss': newValidationLoss, 'set': 'validation'});
        embed(
            '#lossCanvas', {
                '$schema': 'https://vega.github.io/schema/vega-lite/v2.json',
                'data': {'values': lossValues},
                'mark': 'line',
                'encoding': {
                    'x': {'field': 'epoch', 'type': 'ordinal'},
                    'y': {'field': 'loss', 'type': 'quantitative'},
                    'color': {'field': 'set', 'type': 'nominal'}
                },
                'width': 500
            },
            {});
    }


}

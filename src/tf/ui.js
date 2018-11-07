/* eslint-disable array-callback-return,multiline-ternary */

import * as tf from '@tensorflow/tfjs';
import _ from 'lodash'
import {POKEMON_TYPES, POKEMON_DATA} from "./data";


export function logitsToSpans(logits) {
    let idxMax = -1;
    let maxLogit = Number.NEGATIVE_INFINITY;
    for (let i = 0; i < logits.length; ++i) {
        if (logits[i] > maxLogit) {
            maxLogit = logits[i];
            idxMax = i;
        }
    }
    const spans = [];
    for (let i = 0; i < logits.length; ++i) {
        const logitSpan = document.createElement('span');
        logitSpan.textContent = logits[i].toFixed(3);
        if (i === idxMax) {
            logitSpan.style['font-weight'] = 'bold';
        }
        logitSpan.classList = ['logit-span'];
        spans.push(logitSpan);
    }
    return spans;
}


export function getName(_row) {

    const found = POKEMON_DATA.find(pokemon => {

        return pokemon[1] == _row[0] && pokemon[2] == _row[1]
    });

    if (found) {
        return found[0]
    }
    return 'n/a';
}






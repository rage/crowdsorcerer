import test from 'ava';
import reducers from 'state/reducer';
import { TEXT_INSERTED } from 'state/actions';


// test('Incorrect answer does not produce correct results', (t) => {
//   const state = reducers(
//     { writerReducer: { text: 'Hell', markers: [], model: 'Hello', correct: false } },
//     { text: 'Hella', type: TEXT_CHANGED });
//   t.false(state.writerReducer.correct);
//   t.false(state.writerReducer.markers.length === 0);
//   t.deepEqual(state.writerReducer.markers[0].endCol, 5);
//   t.deepEqual(state.writerReducer.markers[0].startCol, 4);
//   t.deepEqual(state.writerReducer.markers[0].endRow, 0);
//   t.deepEqual(state.writerReducer.markers[0].startRow, 0);
// });

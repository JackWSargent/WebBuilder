// else if (shift) {
//   if (selected.length == 1) {
//     let newSelected = sortedLayers;
//     let end = sortedLayers.indexOf(layer);
//     let start = {};
//     let arr = sortedLayers.map(layer => {
//       if (layer.id == selected[0]) {
//         start = layer;
//       }
//     });
//     let newStart = sortedLayers.indexOf(start);
//     newSelected = newSelected.slice(newStart, end + 1);
//     let newSelection = [];
//     newSelection = newSelected.map(component => {
//       if (selected.includes(component.id)) {
//         return {
//           ...component,
//           selected: !component.selected
//         };
//       }
//     });
//     console.log(newSelected);
//     setSelected(newSelected);
//     let newLayers = [...layers, newSelection];
//     setLayers(newLayers);
//   }

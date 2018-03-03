
import sceneStore from '../src/stores/sceneStore'
import pulseStore from '../src/stores/pulseStore'
import consoleStore from '../src/stores/consoleStore'
import channelStore from '../src/stores/channelStore'
import globalStore from '../src/stores/globalStore'


export const save = () => {
    sceneStore.save(); 
    consoleStore.save();
    globalStore.save();
    console.log(' ## Saving...')
    return false;
}

export const timer = () => {
    if (pulseStore.isActive) 
        pulseStore.stopPulse();
    else
        pulseStore.startPulse();
}

// export const selectNCells = () => {
//     if ((array === undefined || channelStore.selected_cells.length == 0)) 
//         pulseStore.stopPulse();
//     else
//         pulseStore.startPulse();
// }


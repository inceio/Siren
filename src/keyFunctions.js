
import sceneStore from '../src/stores/sceneStore'
import pulseStore from '../src/stores/pulseStore'
import consoleStore from '../src/stores/consoleStore'


export const save = () => {
    sceneStore.save(); 
    consoleStore.save();
    console.log(' ## Saving...')
    return false;
}

export const timer = () => {
    if (pulseStore.isActive) 
        pulseStore.stopPulse();
    else
        pulseStore.startPulse();
}


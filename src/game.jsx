import { useStore } from '../hooks/useStore'

// Add a new set of platforms when user reaches a certain position index
const [addPlatform] = useStore((state) => [state.addPlatform])

// find max index of existing platforms, make x more platforms on top of that
// build platforms in the direction in front of player
// min and max distances between each platform depends on the level
// positions are semi-randomized within those min and max
// platform color depends on its level as well

import { StyleSheet, Dimensions } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'
const { height } = Dimensions.get('window')

const MODAL_MARGIN_TOP = Math.floor(scale(height / 4))

export const useStyles = (theme) => StyleSheet.create({
    iconContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    layout: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    container: {
        marginTop: MODAL_MARGIN_TOP, flex: 1,
        backgroundColor: theme.white,
        borderTopLeftRadius: scale(15),
        borderTopRightRadius: scale(15),
        ...alignment.Psmall,
    },
    topContainer: {
        flex: 1,
        maxHeight: scale(40),
        alignItems: 'flex-end'
    },
    closeButton: {
        backgroundColor: theme.newButtonBackground,
        paddingVertical: scale(8),
        paddingHorizontal: scale(10),
        borderRadius: scale(4)
    },
    secondaryText: {
        lineHeight: scale(24),
        marginTop: scale(8)
    },
    ternaryText: {
        lineHeight: scale(18),
        marginTop: scale(10)
    }
})

import { StyleSheet, Dimensions } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'
import { textStyles } from '../../utils/textStyles'
const { height } = Dimensions.get('window')

const BACKDROP_HEIGHT = Math.floor(scale(height / 5))

export const useStyles = (theme) => StyleSheet.create({
    iconContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme?.isRTL ? { transform: [{ scaleX: -1 }] } : {}
    },
    backdrop: {
        height: BACKDROP_HEIGHT
    },
    layout: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    container: {
        flex: 1,
        backgroundColor: theme.cardBackground,
        borderTopLeftRadius: scale(15),
        borderTopRightRadius: scale(15),
        ...alignment.Psmall,
    },
    topContainer: {
        flex: 1,
        maxHeight: scale(40),
        alignItems: theme?.isRTL ? 'flex-start' : 'flex-end'
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
    },
    inputContainer: {
        ...alignment.MTlarge,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme.verticalLine,
        borderRadius: scale(5),
        flexDirection: theme?.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center'
    },
    textInput: {
        padding: scale(10),
        ...textStyles.H4,
        flex: 1,
        color: theme.fontMainColor,
        textAlign: theme?.isRTL ? 'right' : 'left'
    },
    clearButton: {
        ...alignment.MRxSmall
    }
})

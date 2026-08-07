import { StyleSheet, Dimensions } from 'react-native'
import { alignment } from '../../utils/alignment'
import { scale } from '../../utils/scaling'
import { textStyles } from '../../utils/textStyles'
const { height } = Dimensions.get('window')

const BACKDROP_HEIGHT = Math.floor(scale(height / 5))

export const useStyles = (theme) => StyleSheet.create({
    instructionRow: {
        minHeight: scale(72),
        flexDirection: theme?.isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: scale(10),
        paddingVertical: scale(11),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.colors?.borderSubtle || 'rgba(128, 128, 128, 0.22)'
    },
    leadingIcon: {
        width: scale(36),
        height: scale(36),
        alignItems: 'center',
        justifyContent: 'center'
    },
    instructionCopy: {
        flex: 1,
        minWidth: 0,
        justifyContent: 'center'
    },
    instructionCaption: {
        lineHeight: scale(18),
        marginTop: scale(2)
    },
    trailingIcon: {
        width: scale(30),
        height: scale(36),
        justifyContent: 'center',
        alignItems: 'center',
        ...(theme?.isRTL ? { transform: [{ scaleX: -1 }] } : {})
    },
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
        alignItems: theme?.isRTL ? 'flex-start' : 'flex-end',
        paddingTop: scale(8),
        ...(theme?.isRTL ? { paddingLeft: scale(6) } : { paddingRight: scale(6) })
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

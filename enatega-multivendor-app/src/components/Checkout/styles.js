import { StyleSheet } from 'react-native'
import { scale } from '../../utils/scaling'

export const useStyles = theme => (StyleSheet.create({
    container: {
        height: scale(40),
        flex: 1,
    },
    ovalContainer: {
        backgroundColor: theme?.gray200,
        flex: 1,
        borderRadius: scale(40),
        marginHorizontal: scale(10),
        marginVertical: scale(5),
        flexDirection: 'row',
    },
    ovalButton: {
        flex: 1,
        borderRadius: scale(40),
        marginHorizontal: scale(2),
        marginVertical: scale(2),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    instructionContainer: {
        padding: scale(10),
        flexDirection: 'row',
        margin: scale(10),
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: scale(10),
        borderColor: theme.gray500
    },
    leftContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    middleContainer: { flex: 6, justifyContent: 'space-evenly' },
}))
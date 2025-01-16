import React from 'react';
import { View, TouchableOpacity, Modal, Text, TouchableWithoutFeedback, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from './styles';
import TextDefault from '../../components/Text/TextDefault/TextDefault';
import { scale } from '../../utils/scaling';
import Spinner from '../../components/Spinner/Spinner';

const DeleteEditModal = ({
    modalVisible,
    setModalVisible,
    currentTheme,
    selectedAddress,
    loading,
    onDelete,
    onEdit,
    t,
    editButton,
    deleteAllButton
}) => {
    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles().layout}>
                <Pressable style={styles().backdrop} onPress={() => setModalVisible(false)} />
                <View style={styles(currentTheme).modalContainer}>
                    <View style={styles(currentTheme).modalView}>
                        <View style={[styles(currentTheme).modalHead]}>
                            <TextDefault Bold H4 textColor={currentTheme.fontMainColor} isRTL>
                                {/* {selectedAddress?.deliveryAddress} */}
                                {selectedAddress ? selectedAddress?.deliveryAddress : t('deleteAddressesTitle')}
                            </TextDefault>
                            <Feather
                                name='x-circle'
                                size={24}
                                color={currentTheme.newFontcolor}
                                onPress={() => setModalVisible(false)}
                            />
                        </View>
                        {deleteAllButton ? (
                            <TouchableOpacity
                                style={[
                                    styles(currentTheme).btn,
                                    styles(currentTheme).btnDelete,
                                    { opacity: loading ? 0.5 : 1 }
                                ]}
                                onPress={() => onDelete()}
                                disabled={loading}
                            >
                                {loading ? (
                                    <Spinner spinnerColor={currentTheme.spinnerColor} backColor='transparent' size='small' />
                                ) : (
                                    <TextDefault bolder H4 textColor={currentTheme.red600}>
                                        {t('delete')}
                                    </TextDefault>
                                )}
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={[
                                    styles(currentTheme).btn,
                                    styles(currentTheme).btnDelete,
                                    { opacity: loading ? 0.5 : 1 }
                                ]}
                                onPress={() => onDelete(selectedAddress._id)}
                                disabled={loading}
                            >
                                {loading ? (
                                    <Spinner spinnerColor={currentTheme.spinnerColor} backColor='transparent' size='small' />
                                ) : (
                                    <TextDefault bolder H4 textColor={currentTheme.red600}>
                                        {t('delete')}
                                    </TextDefault>
                                )}
                            </TouchableOpacity>
                        )}
                        {editButton && (
                            <TouchableOpacity
                                style={[
                                    styles(currentTheme).btn,
                                    styles(currentTheme).btnEdit,
                                    { opacity: loading ? 0.5 : 1 }
                                ]}
                                onPress={() => onEdit(selectedAddress)}
                                disabled={loading}
                            >
                                <TextDefault bolder H4 textColor={currentTheme.linkColor}>
                                    {t('edit')}
                                </TextDefault>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles(currentTheme).btn, styles(currentTheme).btnCancel]}
                            onPress={() => {
                                setModalVisible(false);
                            }}
                            disabled={loading}
                        >
                            <TextDefault bolder H4 textColor={currentTheme.fontMainColor}>
                                {t('cancel')}
                            </TextDefault>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default DeleteEditModal;

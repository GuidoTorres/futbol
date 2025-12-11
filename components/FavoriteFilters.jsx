import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * FavoriteFilters - Componente para gestionar filtros favoritos
 * Permite guardar, cargar y eliminar configuraciones de filtros
 */
const FavoriteFilters = ({
  visible,
  onClose,
  favoriteFilters = [],
  onLoadFilter,
  onSaveFilter,
  onDeleteFilter,
  currentFilters,
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveFilter = async () => {
    if (!filterName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para el filtro');
      return;
    }

    if (Object.keys(currentFilters).length === 0) {
      Alert.alert('Error', 'No hay filtros activos para guardar');
      return;
    }

    setIsSaving(true);
    try {
      await onSaveFilter(filterName.trim(), currentFilters);
      setFilterName('');
      setShowSaveDialog(false);
      Alert.alert('Éxito', 'Filtro guardado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el filtro');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFilter = (filterId, filterName) => {
    Alert.alert(
      'Eliminar filtro',
      `¿Estás seguro de que deseas eliminar "${filterName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDeleteFilter(filterId),
        },
      ]
    );
  };

  const handleLoadFilter = (filter) => {
    onLoadFilter(filter.config);
    onClose();
  };

  const getFilterSummary = (config) => {
    const activeFilters = Object.keys(config).filter((key) => {
      const value = config[key];
      return (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
      );
    });

    return `${activeFilters.length} filtro(s)`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Filtros Favoritos</Text>
            <TouchableOpacity onPress={() => setShowSaveDialog(true)}>
              <Ionicons name="add-circle" size={24} color="#00ff87" />
            </TouchableOpacity>
          </View>

          {/* Favorite Filters List */}
          <ScrollView style={styles.filtersContainer}>
            {favoriteFilters.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="bookmark-outline" size={64} color="#666" />
                <Text style={styles.emptyStateTitle}>
                  No tienes filtros guardados
                </Text>
                <Text style={styles.emptyStateText}>
                  Guarda tus combinaciones de filtros favoritas para acceder
                  rápidamente a ellas
                </Text>
              </View>
            ) : (
              favoriteFilters.map((filter) => (
                <View key={filter.id} style={styles.filterCard}>
                  <TouchableOpacity
                    style={styles.filterCardContent}
                    onPress={() => handleLoadFilter(filter)}
                  >
                    <View style={styles.filterCardHeader}>
                      <Ionicons name="bookmark" size={20} color="#00ff87" />
                      <Text style={styles.filterCardTitle}>{filter.name}</Text>
                    </View>
                    <Text style={styles.filterCardSummary}>
                      {getFilterSummary(filter.config)}
                    </Text>
                    <Text style={styles.filterCardDate}>
                      Guardado: {formatDate(filter.createdAt)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteFilter(filter.id, filter.name)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>

          {/* Save Dialog */}
          {showSaveDialog && (
            <View style={styles.saveDialog}>
              <View style={styles.saveDialogContent}>
                <Text style={styles.saveDialogTitle}>Guardar Filtro</Text>
                <TextInput
                  style={styles.saveDialogInput}
                  placeholder="Nombre del filtro"
                  placeholderTextColor="#666"
                  value={filterName}
                  onChangeText={setFilterName}
                  autoFocus
                />
                <View style={styles.saveDialogButtons}>
                  <TouchableOpacity
                    style={[styles.saveDialogButton, styles.cancelButton]}
                    onPress={() => {
                      setShowSaveDialog(false);
                      setFilterName('');
                    }}
                    disabled={isSaving}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.saveDialogButton, styles.saveButton]}
                    onPress={handleSaveFilter}
                    disabled={isSaving}
                  >
                    <Text style={styles.saveButtonText}>
                      {isSaving ? 'Guardando...' : 'Guardar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  filtersContainer: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  filterCard: {
    backgroundColor: '#252525',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  filterCardContent: {
    flex: 1,
    padding: 16,
  },
  filterCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  filterCardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  filterCardSummary: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  filterCardDate: {
    color: '#666',
    fontSize: 12,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
  },
  saveDialog: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  saveDialogContent: {
    backgroundColor: '#252525',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  saveDialogTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  saveDialogInput: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  saveDialogButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  saveDialogButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#00ff87',
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default FavoriteFilters;

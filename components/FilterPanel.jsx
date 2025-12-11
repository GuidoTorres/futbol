import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * FilterPanel - Panel de filtros avanzado con múltiples opciones
 * Soporta filtros por liga, temporada, posición, nacionalidad y más
 */
const FilterPanel = ({
  visible,
  onClose,
  onApplyFilters,
  filterOptions,
  initialFilters = {},
  entityType = 'all', // 'player', 'team', 'match', 'all'
}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleMultiSelectToggle = (key, value) => {
    setFilters((prev) => {
      const currentValues = prev[key] || [];
      const isSelected = currentValues.includes(value);

      return {
        ...prev,
        [key]: isSelected
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value],
      };
    });
  };

  const handleApply = () => {
    // Remover filtros vacíos
    const cleanedFilters = Object.keys(filters).reduce((acc, key) => {
      const value = filters[key];
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        acc[key] = value;
      }
      return acc;
    }, {});

    onApplyFilters(cleanedFilters);
    onClose();
  };

  const handleClear = () => {
    setFilters({});
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter((key) => {
      const value = filters[key];
      return (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
      );
    }).length;
  };

  const renderFilterSection = (title, key, options, multiSelect = false) => {
    const isActive = activeSection === key;
    const selectedValue = filters[key];
    const hasSelection = multiSelect
      ? selectedValue && selectedValue.length > 0
      : selectedValue !== undefined && selectedValue !== null && selectedValue !== '';

    return (
      <View style={styles.filterSection}>
        <TouchableOpacity
          style={styles.filterHeader}
          onPress={() => setActiveSection(isActive ? null : key)}
        >
          <View style={styles.filterHeaderLeft}>
            <Text style={styles.filterTitle}>{title}</Text>
            {hasSelection && (
              <View style={styles.selectionBadge}>
                <Text style={styles.selectionBadgeText}>
                  {multiSelect ? selectedValue.length : '1'}
                </Text>
              </View>
            )}
          </View>
          <Ionicons
            name={isActive ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#888"
          />
        </TouchableOpacity>

        {isActive && (
          <View style={styles.filterContent}>
            {options && options.length > 0 ? (
              <ScrollView style={styles.optionsList} nestedScrollEnabled>
                {options.map((option) => {
                  const optionValue = typeof option === 'object' ? option.id : option;
                  const optionLabel = typeof option === 'object' ? option.name : option;
                  const isSelected = multiSelect
                    ? selectedValue && selectedValue.includes(optionValue)
                    : selectedValue === optionValue;

                  return (
                    <TouchableOpacity
                      key={optionValue}
                      style={[
                        styles.optionItem,
                        isSelected && styles.optionItemSelected,
                      ]}
                      onPress={() =>
                        multiSelect
                          ? handleMultiSelectToggle(key, optionValue)
                          : handleFilterChange(key, optionValue)
                      }
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {optionLabel}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark" size={20} color="#00ff87" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : (
              <Text style={styles.noOptionsText}>No hay opciones disponibles</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderRangeFilter = (title, minKey, maxKey, placeholder) => {
    const isActive = activeSection === `${minKey}_${maxKey}`;

    return (
      <View style={styles.filterSection}>
        <TouchableOpacity
          style={styles.filterHeader}
          onPress={() =>
            setActiveSection(isActive ? null : `${minKey}_${maxKey}`)
          }
        >
          <Text style={styles.filterTitle}>{title}</Text>
          <Ionicons
            name={isActive ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#888"
          />
        </TouchableOpacity>

        {isActive && (
          <View style={styles.filterContent}>
            <View style={styles.rangeContainer}>
              <TextInput
                style={styles.rangeInput}
                placeholder={`Min ${placeholder}`}
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={filters[minKey]?.toString() || ''}
                onChangeText={(text) => handleFilterChange(minKey, text)}
              />
              <Text style={styles.rangeSeparator}>-</Text>
              <TextInput
                style={styles.rangeInput}
                placeholder={`Max ${placeholder}`}
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={filters[maxKey]?.toString() || ''}
                onChangeText={(text) => handleFilterChange(maxKey, text)}
              />
            </View>
          </View>
        )}
      </View>
    );
  };

  if (!filterOptions) {
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#00ff87" />
            <Text style={styles.loadingText}>Cargando opciones...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Filtros</Text>
            <TouchableOpacity onPress={handleClear}>
              <Text style={styles.clearText}>Limpiar</Text>
            </TouchableOpacity>
          </View>

          {/* Active Filters Count */}
          {getActiveFiltersCount() > 0 && (
            <View style={styles.activeFiltersBar}>
              <Text style={styles.activeFiltersText}>
                {getActiveFiltersCount()} filtro(s) activo(s)
              </Text>
            </View>
          )}

          {/* Filters */}
          <ScrollView style={styles.filtersContainer}>
            {/* Liga */}
            {filterOptions.leagues &&
              (entityType === 'all' ||
                entityType === 'player' ||
                entityType === 'team' ||
                entityType === 'match') &&
              renderFilterSection('Liga', 'league', filterOptions.leagues, false)}

            {/* Temporada */}
            {filterOptions.seasons &&
              (entityType === 'all' || entityType === 'match') &&
              renderFilterSection('Temporada', 'season', filterOptions.seasons, false)}

            {/* Posición (solo para jugadores) */}
            {filterOptions.positions &&
              (entityType === 'all' || entityType === 'player') &&
              renderFilterSection(
                'Posición',
                'position',
                filterOptions.positions,
                true
              )}

            {/* Nacionalidad (solo para jugadores) */}
            {filterOptions.nationalities &&
              (entityType === 'all' || entityType === 'player') &&
              renderFilterSection(
                'Nacionalidad',
                'nationality',
                filterOptions.nationalities,
                true
              )}

            {/* País (para equipos) */}
            {filterOptions.countries &&
              (entityType === 'all' || entityType === 'team') &&
              renderFilterSection(
                'País',
                'country',
                filterOptions.countries,
                true
              )}

            {/* Estado (para partidos) */}
            {filterOptions.statuses &&
              (entityType === 'all' || entityType === 'match') &&
              renderFilterSection(
                'Estado',
                'status',
                filterOptions.statuses,
                true
              )}

            {/* Rango de edad (para jugadores) */}
            {(entityType === 'all' || entityType === 'player') &&
              renderRangeFilter('Edad', 'minAge', 'maxAge', 'años')}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
            </TouchableOpacity>
          </View>
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
    maxHeight: '90%',
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
  clearText: {
    color: '#00ff87',
    fontSize: 16,
  },
  activeFiltersBar: {
    backgroundColor: '#252525',
    padding: 12,
    alignItems: 'center',
  },
  activeFiltersText: {
    color: '#00ff87',
    fontSize: 14,
    fontWeight: '500',
  },
  filtersContainer: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 16,
    backgroundColor: '#252525',
    borderRadius: 8,
    overflow: 'hidden',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  filterHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  selectionBadge: {
    backgroundColor: '#00ff87',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  selectionBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '700',
  },
  filterContent: {
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  optionsList: {
    maxHeight: 200,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  optionItemSelected: {
    backgroundColor: 'rgba(0, 255, 135, 0.1)',
  },
  optionText: {
    color: '#fff',
    fontSize: 14,
  },
  optionTextSelected: {
    color: '#00ff87',
    fontWeight: '600',
  },
  noOptionsText: {
    color: '#666',
    fontSize: 14,
    padding: 16,
    textAlign: 'center',
  },
  rangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  rangeInput: {
    flex: 1,
    backgroundColor: '#333',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
  },
  rangeSeparator: {
    color: '#888',
    fontSize: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  applyButton: {
    backgroundColor: '#00ff87',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 14,
  },
});

export default FilterPanel;

import React, { createContext, useReducer, useEffect, useContext } from 'react';
import {
  fetchRulesForAccommodation,
  addRuleToAccommodation,
  updateRuleInAccommodation,
  deleteRuleFromAccommodation,
} from '../../../services/firestoreService';
import { useAuth } from '../../../Context/AuthProvider';

export const RulesContext = createContext();

const initialState = {
  selectedAccommodation: null,
  ruleData: {
    priority: 2,
    package: 'Diárias',
    price: 0,
    checkIn: null,
    checkOut: null,
    maxQuantity: 0,
    maxAdditionalPeople: 0,
    pricePerAdditionalPerson: 0,
  },
  rules: [],
  message: '',
  isEditing: false,
  ruleId: '',
};

function rulesReducer(state, action) {
  switch (action.type) {
    case 'SET_ACCOMMODATION':
      return { ...state, selectedAccommodation: action.payload };
    case 'UPDATE_RULE_DATA':
      return { ...state, ruleData: { ...state.ruleData, ...action.payload } };
    case 'SET_RULES':
      return { ...state, rules: action.payload };
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    case 'SET_EDIT_MODE':
      return { ...state, isEditing: action.payload, ruleId: action.ruleId || '' };
    case 'RESET_RULE_DATA':
      return { ...state, ruleData: initialState.ruleData, isEditing: false, ruleId: '' };
    default:
      return state;
  }
}

export const RulesProvider = ({ children }) => {
  const { verifyAdmin } = useAuth();
  const [state, dispatch] = useReducer(rulesReducer, initialState);

  useEffect(() => {
    if (state.selectedAccommodation) {
      fetchRulesForAccommodation(state.selectedAccommodation.id).then((rules) => {
        dispatch({ type: 'SET_RULES', payload: rules });
      });
    }
  }, [state.selectedAccommodation]);

  const handleRuleAction = async (actionType) => {
    if (!state.selectedAccommodation) return;
    try {
      await verifyAdmin();
      const rulePayload = { ...state.ruleData, UpdatedAt: new Date() };
      if (actionType === 'create') {
        await addRuleToAccommodation(state.selectedAccommodation.id, rulePayload);
      } else if (actionType === 'edit') {
        await updateRuleInAccommodation(state.selectedAccommodation.id, state.ruleId, rulePayload);
      } else if (actionType === 'delete') {
        await deleteRuleFromAccommodation(state.selectedAccommodation.id, state.ruleId);
      }
      dispatch({ type: 'SET_MESSAGE', payload: 'Ação realizada com sucesso!' });
      fetchRulesForAccommodation(state.selectedAccommodation.id).then((rules) => {
        dispatch({ type: 'SET_RULES', payload: rules });
      });
    } catch (error) {
      console.error('Erro na ação da regra:', error);
    }
  };

  return (
    <RulesContext.Provider
      value={{
        ...state,
        dispatch,
        handleRuleAction,
      }}
    >
      {children}
    </RulesContext.Provider>
  );
};

export const useRules = () => useContext(RulesContext);

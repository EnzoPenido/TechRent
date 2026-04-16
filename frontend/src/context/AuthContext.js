"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    setToken(savedToken);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
  }, []);

  const login = async (email, senha) => {
    try {
      console.log('Starting login attempt for:', email);
      const res = await axios.post('http://localhost:3001/auth/login', { email, senha });
      console.log('Login response:', res.data);
      setToken(res.data.token);
      setUser(res.data.usuario);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.usuario));
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      return true;
    } catch (error) {
      console.error('Login error:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error:', error);
      }
      return false;
    }
  };

  const register = async (nome, email, senha) => {
    try {
      console.log('Starting registration for:', email);
      const res = await axios.post('http://localhost:3001/auth/registro', { nome, email, senha, nivel_acesso: 'cliente' });
      console.log('Registration response:', res.data);
      return { success: true, message: res.data.mensagem || 'Cadastro realizado com sucesso.' };
    } catch (error) {
      console.error('Registration error:', error.message);
      let message = 'Erro ao criar conta.';
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        if (error.response.data && error.response.data.mensagem) {
          message = error.response.data.mensagem;
        } else if (typeof error.response.data === 'string') {
          message = error.response.data;
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        message = 'Não foi possível conectar ao servidor.';
      } else {
        console.error('Error:', error);
      }
      return { success: false, message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  if (!mounted) return <>{children}</>;

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
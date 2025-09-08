"use client";

import { useState, useEffect } from "react";
import { Bell, X } from 'lucide-react';
import { useLanguage } from "../components/LanguageContext";
import { useNotification } from "../components/Notification";

interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function TopBar() {
  const { language, setLanguage } = useLanguage();
  const { showNotification } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'info',
      title: 'Bem-vindo ao Sistema',
      message: 'Sistema de gerenciamento de dados inicializado com sucesso.',
      time: 'Agora',
      read: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Atualização Disponível',
      message: 'Nova versão do sistema está disponível para download.',
      time: '2 horas atrás',
      read: false
    },
    {
      id: '3',
      type: 'success',
      title: 'Backup Concluído',
      message: 'Backup automático dos dados realizado com sucesso.',
      time: '1 dia atrás',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLanguageChange = (newLanguage: 'pt' | 'en') => {
    setLanguage(newLanguage);
    showNotification('success', `Idioma alterado para ${newLanguage === 'pt' ? 'Português' : 'English'}`);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center space-x-4">
      {/* Seletor de Idioma com Bandeiras - Design Criativo */}
      <div className="relative group">
        <div className="flex items-center bg-white rounded-full shadow-lg border border-gray-200 p-1 relative overflow-hidden">
          {/* Indicador de idioma ativo com animação suave */}
          <div
            className={`absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg transition-all duration-500 ease-in-out ${
              language === 'pt' ? 'left-1 right-1/2' : 'left-1/2 right-1'
            }`}
          />

          <button
            onClick={() => handleLanguageChange('pt')}
            className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 z-10 ${
              language === 'pt'
                ? 'text-white transform scale-110'
                : 'text-gray-600 hover:text-gray-800 hover:scale-105'
            }`}
            title="Português (Brasil)"
          >
            🇧🇷
            {language === 'pt' && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse" />
            )}
          </button>

          <button
            onClick={() => handleLanguageChange('en')}
            className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 z-10 ${
              language === 'en'
                ? 'text-white transform scale-110'
                : 'text-gray-600 hover:text-gray-800 hover:scale-105'
            }`}
            title="English (US)"
          >
            🇺🇸
            {language === 'en' && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse" />
            )}
          </button>
        </div>

        {/* Tooltip informativo */}
        <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap shadow-lg">
          <div className="relative">
            {language === 'pt' ? '🇧🇷 Português Ativo' : '🇺🇸 English Active'}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
          </div>
        </div>
      </div>

      {/* Notificações com Design Criativo */}
      <div className="relative group">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className={`relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg border transition-all duration-300 ${
            unreadCount > 0
              ? 'bg-gradient-to-r from-red-500 to-red-600 border-red-300 text-white shadow-red-200'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
          title={`Notificações ${unreadCount > 0 ? `(${unreadCount} não lidas)` : ''}`}
        >
          <Bell size={20} className={unreadCount > 0 ? 'text-white' : 'text-gray-600'} />

          {/* Indicador de notificações não lidas com animação */}
          {unreadCount > 0 && (
            <>
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-800 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white animate-bounce">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
              {/* Efeito de brilho pulsante */}
              <div className="absolute inset-0 rounded-full bg-red-400 opacity-20 animate-ping" />
            </>
          )}
        </button>

        {/* Dropdown de Notificações com Design Criativo */}
        {showNotifications && (
          <>
            {/* Overlay para fechar com fade */}
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-10 backdrop-blur-sm"
              onClick={() => setShowNotifications(false)}
            />

            {/* Dropdown */}
            <div className="absolute right-0 top-14 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden transform transition-all duration-300 ease-out">
              {/* Header com gradiente */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell size={20} />
                    <h3 className="text-lg font-semibold">Notificações</h3>
                    {unreadCount > 0 && (
                      <span className="bg-yellow-400 text-blue-800 text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                        {unreadCount} nova{unreadCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors duration-200"
                      >
                        Marcar todas como lidas
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-white/70 hover:text-white transition-colors duration-200"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista de Notificações */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="mb-4">
                      <Bell size={48} className="mx-auto text-gray-300 animate-bounce" />
                    </div>
                    <p className="text-lg font-medium mb-2">Nenhuma notificação</p>
                    <p className="text-sm">Você está tudo em dia! 🎉</p>
                  </div>
                ) : (
                  notifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                        !notification.read ? getNotificationColor(notification.type) : ''
                      } ${index === 0 ? 'border-t-0' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 text-2xl animate-pulse">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 animate-pulse"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-xs text-gray-400">
                              {notification.time}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              notification.type === 'success' ? 'bg-green-100 text-green-800' :
                              notification.type === 'error' ? 'bg-red-100 text-red-800' :
                              notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {notification.type === 'success' ? 'Sucesso' :
                               notification.type === 'error' ? 'Erro' :
                               notification.type === 'warning' ? 'Aviso' : 'Info'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                  📋 Ver todas as notificações
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

"use client";
import React from 'react';
import Provider from '@/app/provider';
import { DashboardProvider } from './provider';

function DashboardLayout({ children }) {
    return (
        <Provider>
            <DashboardProvider>
                {children}
            </DashboardProvider>
        </Provider>
    );
}

export default DashboardLayout;
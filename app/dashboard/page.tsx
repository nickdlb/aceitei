'use client';

import React, { useState } from 'react';
import Header from '@/components/dashboard/header/Header';
import ImageFeed from '@/components/dashboard/feed/ImageFeed';
import { useImages } from '@/hooks/useImages';

const DashboardPage = () => {
    const { images, loading } = useImages();

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <ImageFeed images={images} />
            </main>
        </div>
    );
};

export default DashboardPage;
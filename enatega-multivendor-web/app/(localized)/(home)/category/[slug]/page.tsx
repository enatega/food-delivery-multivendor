"use client";

import { CuisineSelection } from '@/lib/ui/screens/protected/home';
import React from 'react'
import { useParams } from 'next/navigation';
import { useAppMode } from '@/lib/mode';
import SingleVendorCategory from '@/lib/ui/single-vendor/Category';

function CategoryPage() {
  const { isSingleVendor } = useAppMode();
  const { slug } = useParams<{ slug: string }>();
  return isSingleVendor ? <SingleVendorCategory categoryId={slug} /> : <CuisineSelection />
}

export default CategoryPage

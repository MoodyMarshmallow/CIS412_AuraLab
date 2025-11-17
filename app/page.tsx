'use client';

import { useState } from 'react';
import { Loader } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { Sidebar } from '@/components/Sidebar';
import { CampaignHeader } from '@/components/CampaignHeader';
import { fetchCampaign, fetchPosts } from '@/lib/api';
import { PostGrid } from '@/components/PostGrid';
import { PostOverlay } from '@/components/PostOverlay';
import { Post } from '@/types/campaign';
import { ComposerBar } from '@/components/ComposerBar';
import styles from './page.module.css';

export default function HomePage() {
  const { data: campaign, isLoading: loadingCampaign } = useQuery({ queryKey: ['campaign'], queryFn: fetchCampaign });
  const { data: posts, isLoading: loadingPosts } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });
  const [selected, setSelected] = useState<Post | null>(null);

  const isLoading = loadingCampaign || loadingPosts;

  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.mainArea}>
        {isLoading || !campaign || !posts ? (
          <div className={styles.loader}>
            <Loader color="orange" size="lg" />
          </div>
        ) : (
          <>
            <CampaignHeader campaign={campaign} />
            <PostGrid posts={posts} onOpen={setSelected} />
          </>
        )}
      </div>
      <ComposerBar />
      <PostOverlay post={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

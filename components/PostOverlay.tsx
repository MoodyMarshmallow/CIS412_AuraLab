'use client';

import { useMemo, useState } from 'react';
import { Box, Button, Group, Image, Paper, SegmentedControl, Stack, Text, Textarea, TextInput } from '@mantine/core';
import { Post } from '@/types/campaign';
import styles from './postOverlay.module.css';

interface Props {
  post: Post | null;
  onClose(): void;
}

export function PostOverlay({ post, onClose }: Props) {
  const [tab, setTab] = useState('preview');
  const [draft, setDraft] = useState(post ?? null);

  const displayPost = useMemo(() => draft ?? post, [draft, post]);

  if (!displayPost) return null;

  return (
    <div className={`${styles.overlay} ${post ? styles.visible : ''}`}>
      <Paper className={styles.panel} radius={40} shadow="xl">
        <Group className={styles.panelHeader} justify="space-between">
          <div>
            <Text className={styles.panelTitle}>{displayPost.title}</Text>
            <Text c="dimmed">Edit copy and review analysis before marking READY.</Text>
          </div>
          <Button variant="subtle" onClick={onClose} color="dark">
            Close
          </Button>
        </Group>
        <div className={styles.contentBody}>
          <Stack className={styles.formColumn} gap="md">
            <TextInput label="Title" value={displayPost.title} radius="lg" size="md" readOnly />
            <Textarea label="Text" value={displayPost.text} minRows={6} radius="lg" readOnly />
            <Textarea label="Media attachments" value={displayPost.mediaPaths.join('\n')} minRows={4} radius="lg" readOnly />
          </Stack>
          <div className={styles.previewColumn}>
            <SegmentedControl
              fullWidth
              color="rgba(188,149,109,1)"
              radius="xl"
              value={tab}
              onChange={setTab}
              data={[
                { label: 'Preview', value: 'preview' },
                { label: 'Analysis', value: 'analysis' }
              ]}
            />
            {tab === 'preview' ? <PreviewCard post={displayPost} /> : <AnalysisPanel post={displayPost} />}
          </div>
        </div>
      </Paper>
    </div>
  );
}

function PreviewCard({ post }: { post: Post }) {
  return (
    <Paper className={styles.previewCard} radius="xl">
      <Group justify="space-between" align="center" className={styles.previewHeader}>
        <Group align="center" gap="sm">
          <div className={styles.avatar} />
          <Stack gap={0}>
            <Text fw={600}>FriendName</Text>
            <Text c="dimmed" fz="sm">
              23 j&apos;aime
            </Text>
          </Stack>
        </Group>
      </Group>
      <Image src={post.mediaPaths[0]} alt={post.title} radius="lg" height={260} fit="cover" />
      <Box mt="md">
        <Text fw={600} mb={4}>
          FriendName
        </Text>
        <Text className={styles.caption}>{post.text}</Text>
      </Box>
    </Paper>
  );
}

function AnalysisPanel({ post }: { post: Post }) {
  return (
    <Paper className={styles.analysisCard} radius="xl">
      <Text fw={600} mb="sm">
        Overall Sentiment
      </Text>
      <Text c="dimmed" mb="md">
        {post.analysis.summary}
      </Text>
      <Text fw={600} mb="xs">
        Could improve in:
      </Text>
      <ol className={styles.analysisList}>
        {post.analysis.improvements.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
      {post.analysis.mediaNotes && (
        <Text mt="md" c="dimmed">
          {post.analysis.mediaNotes}
        </Text>
      )}
    </Paper>
  );
}

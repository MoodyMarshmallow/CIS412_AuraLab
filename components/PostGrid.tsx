'use client';

import { Card, Grid, Image, Text, ThemeIcon } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { Post } from '@/types/campaign';
import styles from './postGrid.module.css';

interface Props {
  posts: Post[];
  onOpen(post: Post): void;
}

export function PostGrid({ posts, onOpen }: Props) {
  return (
    <Grid gutter="lg" className={styles.grid}>
      {posts.map((post) => (
        <Grid.Col key={post.id} span={{ base: 12, sm: 6, md: 4 }}>
          <Card className={styles.card} padding="md" radius="xl" onClick={() => onOpen(post)}>
            <div className={styles.thumbnail}>
              <Image src={post.mediaPaths[0]} alt={post.title} radius="lg" height={180} fit="cover" />
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardHeader}>
                <Text fw={600}>{post.title}</Text>
                {post.status === 'READY' && (
                  <ThemeIcon size="md" radius="xl" color="teal" variant="light">
                    <IconCheck size={16} />
                  </ThemeIcon>
                )}
              </div>
              <Text className={styles.caption}>{post.text}</Text>
            </div>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
}

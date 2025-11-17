'use client';

import { Badge, Button, ScrollArea, Stack, TextInput, UnstyledButton } from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import styles from './sidebar.module.css';

const campaigns = ['New Campaign', 'Scenery Campaign', 'Shoe Campaign', 'Personal Posts'];

export function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.searchRow}>
        <TextInput placeholder="Search" leftSection={<IconSearch size={18} stroke={1.8} />} radius="md" />
        <Button leftSection={<IconPlus size={18} />} color="rgba(255,255,255,0.8)" variant="gradient" gradient={{ from: '#d9b59a', to: '#c78f65' }}>
          New
        </Button>
      </div>
      <ScrollArea className={styles.scroll}>
        <Stack gap="xs">
          {campaigns.map((name) => (
            <UnstyledButton key={name} className={`${styles.campaignButton} ${name === 'Scenery Campaign' ? styles.active : ''}`}>
              <span>{name}</span>
              {name === 'Scenery Campaign' && <Badge color="rgba(205,147,106,0.35)" variant="light">LIVE</Badge>}
            </UnstyledButton>
          ))}
        </Stack>
      </ScrollArea>
    </div>
  );
}

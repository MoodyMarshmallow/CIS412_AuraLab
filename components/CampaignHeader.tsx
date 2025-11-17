'use client';

import { Badge, Button, Group, Paper, Stack, Text } from '@mantine/core';
import { IconCloudUpload } from '@tabler/icons-react';
import { Campaign } from '@/types/campaign';
import styles from './campaignHeader.module.css';

export function CampaignHeader({ campaign }: { campaign: Campaign }) {
  return (
    <Stack gap="md" className={styles.container}>
      <Group justify="space-between" align="flex-start">
        <div>
          <Text className={styles.title}>{campaign.title}</Text>
          <Text className={styles.subtitle}>{campaign.guidelines}</Text>
        </div>
        <Button
          variant="light"
          size="lg"
          radius="xl"
          leftSection={<IconCloudUpload size={20} />}
          styles={{ label: { fontWeight: 600 } }}
        >
          Add References
          <Badge ml="xs" color="rgba(255,255,255,0.5)" variant="outline">
            +23
          </Badge>
        </Button>
      </Group>
      <Paper p="lg" radius="xl" className={styles.brief}>
        <Text fw={600} mb="sm">
          Campaign Prompt
        </Text>
        <Text>{campaign.prompt}</Text>
      </Paper>
    </Stack>
  );
}

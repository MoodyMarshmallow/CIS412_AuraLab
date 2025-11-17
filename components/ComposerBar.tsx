'use client';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Group, Paper, TextInput } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import styles from './composerBar.module.css';

const schema = z.object({
  prompt: z.string().min(4, 'Prompt is too short')
});

type FormValues = z.infer<typeof schema>;

export function ComposerBar() {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { prompt: '' },
    resolver: zodResolver(schema)
  });

  function onSubmit(values: FormValues) {
    // eslint-disable-next-line no-alert
    alert(`Simulated generation with prompt: ${values.prompt}`);
    reset();
  }

  return (
    <Paper component="form" onSubmit={handleSubmit(onSubmit)} className={styles.composer} radius={40} shadow="xl">
      <Controller
        control={control}
        name="prompt"
        render={({ field, fieldState }) => (
          <TextInput
            {...field}
            placeholder="Make a new post here"
            className={styles.input}
            radius="xl"
            error={fieldState.error?.message}
          />
        )}
      />
      <Button type="submit" radius="xl" size="lg" rightSection={<IconSend size={18} />}>
        Generate
      </Button>
    </Paper>
  );
}

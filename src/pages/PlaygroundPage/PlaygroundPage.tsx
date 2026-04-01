import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';

import { Link } from 'react-router-dom';

import { LoadingSpinner } from '@/components/feedback/Loading/LoadingSpinner';
import PlaceholderPage from '@/components/layout/PlaceholderPage/PlaceholderPage';
import Modal from '@/components/overlay/Modal/Modal';
import Button from '@/components/ui/Button/Button';
import { TextAreaField, TextField } from '@/components/ui/TextField/TextField';
import { useExampleItemsQuery } from '@/query/useExampleItemsQuery';
import { routePaths } from '@/routes/routeRegistry';
import { useToastStore } from '@/stores/useToastStore';

import styles from './PlaygroundPage.module.scss';

interface DemoFormValues {
  clientName: string;
  projectNotes: string;
}

const INITIAL_FORM_VALUES: DemoFormValues = {
  clientName: '',
  projectNotes: '',
};

const PlaygroundPage = () => {
  const [formValues, setFormValues] = useState<DemoFormValues>(INITIAL_FORM_VALUES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const clientNameRef = useRef<HTMLInputElement | null>(null);
  const showToast = useToastStore((state) => state.showToast);
  const { data, error, isError, isPending } = useExampleItemsQuery();
  const exampleItems = data?.items ?? [];

  const handleFieldChange =
    (field: keyof DemoFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const nextValue = event.currentTarget.value;

      setFormValues((current) => ({
        ...current,
        [field]: nextValue,
      }));
    };

  const handleSubmitDemoForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    showToast({
      message: formValues.clientName.trim()
        ? `Saved "${formValues.clientName.trim()}" as a demo input.`
        : 'Saved a blank demo form. Replace this with your real form flow.',
      variant: 'success',
    });
  };

  return (
    <div className={styles['page']}>
      <section className={styles['intro']}>
        <div className={styles['introText']}>
          <p className={styles['sectionEyebrow']}>Component Playground</p>
          <h1 className={styles['pageTitle']}>
            Use this screen as a swap-in surface for your next build.
          </h1>
          <p className={styles['pageDescription']}>
            The UI below deliberately exercises the retained primitives: buttons, fields, modal
            focus management, toast feedback, and an async list backed by MSW.
          </p>
        </div>

        <Link className={styles['backLink']} to={routePaths.home}>
          Back to Starter
        </Link>
      </section>

      <section className={styles['sectionGrid']}>
        <article className={styles['panel']}>
          <div className={styles['panelHeader']}>
            <p className={styles['panelTitle']}>Buttons and Feedback</p>
            <p className={styles['panelDescription']}>Shared CTA styles and toast variants.</p>
          </div>

          <div className={styles['buttonRow']}>
            <Button
              onClick={() => {
                showToast({ message: 'Informational toast from the shared store.' });
              }}
            >
              Info Toast
            </Button>
            <Button
              onClick={() => {
                showToast({ message: 'Success state confirmed.', variant: 'success' });
              }}
              variant='secondary'
            >
              Success Toast
            </Button>
            <Button
              onClick={() => {
                showToast({ message: 'Error state sample.', variant: 'error' });
              }}
              variant='danger'
            >
              Error Toast
            </Button>
          </div>

          <div className={styles['buttonRow']}>
            <Button
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              Open Modal
            </Button>
            <Button disabled variant='secondary'>
              Disabled
            </Button>
          </div>
        </article>

        <article className={styles['panel']}>
          <div className={styles['panelHeader']}>
            <p className={styles['panelTitle']}>Form Primitives</p>
            <p className={styles['panelDescription']}>
              Replace this mini form with your next client workflow.
            </p>
          </div>

          <form className={styles['demoForm']} onSubmit={handleSubmitDemoForm}>
            <TextField
              label='Client Name'
              name='clientName'
              onChange={handleFieldChange('clientName')}
              value={formValues.clientName}
            />
            <TextAreaField
              label='Project Notes'
              name='projectNotes'
              onChange={handleFieldChange('projectNotes')}
              rows={5}
              value={formValues.projectNotes}
            />
            <div className={styles['formActions']}>
              <Button type='submit'>Save Demo Input</Button>
            </div>
          </form>
        </article>
      </section>

      <section className={styles['panel']}>
        <div className={styles['panelHeader']}>
          <p className={styles['panelTitle']}>Async Data Example</p>
          <p className={styles['panelDescription']}>
            `React Query + axios + MSW` remain connected through one neutral endpoint.
          </p>
        </div>

        {isPending ? (
          <div className={styles['loadingState']}>
            <LoadingSpinner />
            <span>Loading example items...</span>
          </div>
        ) : null}

        {isError ? (
          <PlaceholderPage
            description={error instanceof Error ? error.message : 'Unexpected async example error.'}
            eyebrow='Example request failed'
            title='The retained data layer is still test-ready.'
          />
        ) : null}

        {!isPending && !isError ? (
          <div className={styles['exampleGrid']}>
            {exampleItems.map((item) => {
              return (
                <article className={styles['exampleCard']} key={item.id}>
                  <span className={styles['exampleTag']}>{item.tag}</span>
                  <h2 className={styles['exampleTitle']}>{item.title}</h2>
                  <p className={styles['exampleSummary']}>{item.summary}</p>
                </article>
              );
            })}
          </div>
        ) : null}
      </section>

      {isModalOpen ? (
        <Modal
          description='This modal demonstrates the retained focus trap and close interactions.'
          initialFocusRef={clientNameRef}
          onClose={() => {
            setIsModalOpen(false);
          }}
          title='Starter Modal'
        >
          <div className={styles['modalBody']}>
            <p className={styles['modalDescription']}>
              Use local state or wire your own higher-level dialog manager. The shared modal
              component already handles overlay clicks, escape, and focus restore.
            </p>
            <TextField label='First Focus Field' name='modalClientName' ref={clientNameRef} />
            <div className={styles['modalActions']}>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                }}
                type='button'
              >
                Close Modal
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

export default PlaygroundPage;

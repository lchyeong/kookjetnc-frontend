import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  businessInquiryCategoryOptions,
  businessInquiryContactItems,
  businessInquiryPrivacyPolicy,
  businessInquirySectionContent,
  partnerLogos,
} from '@/features/haatzHome/data';
import { classNames } from '@/utils/classNames';

import styles from './BusinessInquirySection.module.scss';

const businessInquirySchema = z.object({
  agreeMarketing: z.boolean(),
  agreePrivacy: z.boolean().refine((value) => value, {
    message: '개인정보 수집·이용에 동의해주세요.',
  }),
  category: z.string().trim().min(1, '문의 분야를 선택해주세요.'),
  companyName: z.string().trim().min(1, '회사명을 입력해주세요.'),
  contactName: z.string().trim().min(1, '담당자명을 입력해주세요.'),
  department: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .min(1, '이메일을 입력해주세요.')
    .refine((value) => z.email().safeParse(value).success, {
      message: '이메일 형식이 올바르지 않습니다.',
    }),
  message: z.string().trim().min(1, '문의 내용을 입력해주세요.'),
  phone: z
    .string()
    .trim()
    .min(1, '연락처를 입력해주세요.')
    .regex(/^[0-9+\-\s()]{8,20}$/, '연락처 형식이 올바르지 않습니다.'),
});

type BusinessInquiryFormValues = z.infer<typeof businessInquirySchema>;

const defaultValues: BusinessInquiryFormValues = {
  agreeMarketing: false,
  agreePrivacy: false,
  category: '',
  companyName: '',
  contactName: '',
  department: '',
  email: '',
  message: '',
  phone: '',
};

const formHeaderContactItems = businessInquiryContactItems.filter((item) => {
  return item.id === 'phone' || item.id === 'email';
});

const BusinessInquirySection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<BusinessInquiryFormValues>({
    defaultValues,
    resolver: zodResolver(businessInquirySchema),
  });

  const handleSubmitInquiry = handleSubmit(() => {
    setIsSubmitted(true);
  });

  useEffect(() => {
    if (!isPrivacyModalOpen || typeof document === 'undefined') {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPrivacyModalOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPrivacyModalOpen]);

  const handleResetForm = () => {
    reset(defaultValues);
    setIsSubmitted(false);
    setIsPrivacyModalOpen(false);
  };

  const renderPartnerLogoList = (isClone = false) => {
    return (
      <ul
        aria-hidden={isClone || undefined}
        className={classNames(styles['logoList'], isClone && styles['logoListClone'])}
      >
        {partnerLogos.map((logo) => {
          return (
            <li className={styles['logoItem']} key={`${isClone ? 'clone' : 'primary'}-${logo.id}`}>
              <img
                alt={isClone ? '' : logo.alt}
                className={styles['logoImage']}
                decoding='async'
                draggable='false'
                src={logo.src}
              />
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className={styles['sectionPanel']} data-testid='business-inquiry-section'>
      <header className={styles['sectionHeading']}>
        <div className={styles['headingCopy']}>
          <p className={styles['eyebrow']}>{businessInquirySectionContent.eyebrow}</p>
          <h2 className={styles['title']}>{businessInquirySectionContent.title}</h2>
          <p className={styles['description']}>{businessInquirySectionContent.description}</p>
        </div>

        {partnerLogos.length > 0 ? (
          <div
            aria-label='주요 고객사 로고'
            className={styles['logoShowcase']}
            data-testid='business-inquiry-partner-marquee'
            role='group'
          >
            <div className={styles['logoMarqueeViewport']}>
              <div className={styles['logoMarqueeTrack']}>
                {renderPartnerLogoList()}
                {renderPartnerLogoList(true)}
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <div className={styles['layout']}>
        <div className={styles['formPanel']}>
          {isSubmitted ? (
            <div
              aria-live='polite'
              className={styles['successPanel']}
              data-testid='business-inquiry-success'
              role='status'
            >
              <span className={styles['successIcon']}>✓</span>
              <strong className={styles['successTitle']}>
                {businessInquirySectionContent.successTitle}
              </strong>
              <p className={styles['successDescription']}>
                {businessInquirySectionContent.successDescription}
              </p>
              <button className={styles['resetButton']} onClick={handleResetForm} type='button'>
                {businessInquirySectionContent.resetLabel}
              </button>
            </div>
          ) : (
            <>
              <div className={styles['formHeader']}>
                <h3 className={styles['formTitle']}>사업 문의를 남겨주세요</h3>
                <p className={styles['formDescription']}>
                  필요한 분야와 현장 조건을 남겨주시면 검토 후 회신드리겠습니다.
                </p>
                <div className={styles['contactInfo']}>
                  {formHeaderContactItems.map((item) => {
                    return (
                      <div className={styles['contactInfoItem']} key={item.id}>
                        <span className={styles['contactInfoLabel']}>{item.label}</span>
                        <a className={styles['contactInfoValue']} href={item.href}>
                          {item.value}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>

              <form
                className={styles['form']}
                data-testid='business-inquiry-form'
                noValidate
                onSubmit={(event) => {
                  void handleSubmitInquiry(event);
                }}
              >
                <div className={styles['formGrid']}>
                  <div className={styles['field']}>
                    <label className={styles['label']} htmlFor='business-inquiry-company-name'>
                      회사명 *
                    </label>
                    <input
                      className={classNames(
                        styles['input'],
                        errors.companyName && styles['inputError'],
                      )}
                      id='business-inquiry-company-name'
                      placeholder='국제티엔씨'
                      type='text'
                      {...register('companyName')}
                    />
                    {errors.companyName ? (
                      <span className={styles['errorText']} role='alert'>
                        {errors.companyName.message}
                      </span>
                    ) : null}
                  </div>

                  <div className={styles['field']}>
                    <label className={styles['label']} htmlFor='business-inquiry-contact-name'>
                      담당자명 *
                    </label>
                    <input
                      className={classNames(
                        styles['input'],
                        errors.contactName && styles['inputError'],
                      )}
                      id='business-inquiry-contact-name'
                      placeholder='홍길동'
                      type='text'
                      {...register('contactName')}
                    />
                    {errors.contactName ? (
                      <span className={styles['errorText']} role='alert'>
                        {errors.contactName.message}
                      </span>
                    ) : null}
                  </div>

                  <div className={styles['field']}>
                    <label className={styles['label']} htmlFor='business-inquiry-department'>
                      직책/부서
                    </label>
                    <input
                      className={styles['input']}
                      id='business-inquiry-department'
                      placeholder='영업팀 / 팀장'
                      type='text'
                      {...register('department')}
                    />
                  </div>

                  <div className={styles['field']}>
                    <label className={styles['label']} htmlFor='business-inquiry-phone'>
                      연락처 *
                    </label>
                    <input
                      className={classNames(styles['input'], errors.phone && styles['inputError'])}
                      id='business-inquiry-phone'
                      inputMode='tel'
                      placeholder='010-1234-5678'
                      type='tel'
                      {...register('phone')}
                    />
                    {errors.phone ? (
                      <span className={styles['errorText']} role='alert'>
                        {errors.phone.message}
                      </span>
                    ) : null}
                  </div>

                  <div className={styles['field']}>
                    <label className={styles['label']} htmlFor='business-inquiry-email'>
                      이메일 *
                    </label>
                    <input
                      className={classNames(styles['input'], errors.email && styles['inputError'])}
                      id='business-inquiry-email'
                      placeholder='name@company.com'
                      type='email'
                      {...register('email')}
                    />
                    {errors.email ? (
                      <span className={styles['errorText']} role='alert'>
                        {errors.email.message}
                      </span>
                    ) : null}
                  </div>

                  <div className={styles['field']}>
                    <label className={styles['label']} htmlFor='business-inquiry-category'>
                      문의 분야 *
                    </label>
                    <select
                      className={classNames(
                        styles['input'],
                        errors.category && styles['inputError'],
                      )}
                      id='business-inquiry-category'
                      {...register('category')}
                    >
                      {businessInquiryCategoryOptions.map((item) => {
                        return (
                          <option key={item.value || 'placeholder'} value={item.value}>
                            {item.label}
                          </option>
                        );
                      })}
                    </select>
                    {errors.category ? (
                      <span className={styles['errorText']} role='alert'>
                        {errors.category.message}
                      </span>
                    ) : null}
                  </div>

                  <div className={classNames(styles['field'], styles['fieldFull'])}>
                    <label className={styles['label']} htmlFor='business-inquiry-message'>
                      문의 내용 *
                    </label>
                    <textarea
                      className={classNames(
                        styles['textarea'],
                        errors.message && styles['inputError'],
                      )}
                      id='business-inquiry-message'
                      placeholder='현장 조건, 필요한 설비 범위, 일정, 검토 요청사항 등을 적어주세요.'
                      rows={6}
                      {...register('message')}
                    />
                    {errors.message ? (
                      <span className={styles['errorText']} role='alert'>
                        {errors.message.message}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className={styles['agreementBox']}>
                  <label
                    className={classNames(
                      styles['checkboxRow'],
                      errors.agreePrivacy && styles['checkboxError'],
                    )}
                    htmlFor='business-inquiry-agree-privacy'
                  >
                    <input
                      className={styles['checkbox']}
                      id='business-inquiry-agree-privacy'
                      type='checkbox'
                      {...register('agreePrivacy')}
                    />
                    <span aria-hidden='true' className={styles['checkmark']} />
                    <span className={styles['checkboxLabel']}>
                      <strong>[필수]</strong> 개인정보 수집·이용 동의
                    </span>
                  </label>
                  <p className={styles['agreementText']}>
                    {businessInquirySectionContent.privacyNotice}
                  </p>
                  <button
                    className={styles['privacyLink']}
                    onClick={() => {
                      setIsPrivacyModalOpen(true);
                    }}
                    type='button'
                  >
                    개인정보처리방침 보기
                  </button>
                  {errors.agreePrivacy ? (
                    <span
                      className={classNames(styles['errorText'], styles['agreementError'])}
                      role='alert'
                    >
                      {errors.agreePrivacy.message}
                    </span>
                  ) : null}
                  <label
                    className={styles['checkboxRow']}
                    htmlFor='business-inquiry-agree-marketing'
                  >
                    <input
                      className={styles['checkbox']}
                      id='business-inquiry-agree-marketing'
                      type='checkbox'
                      {...register('agreeMarketing')}
                    />
                    <span aria-hidden='true' className={styles['checkmark']} />
                    <span className={styles['checkboxLabel']}>
                      <strong>[선택]</strong> 마케팅 정보 수신 동의
                    </span>
                  </label>
                  <p className={styles['agreementText']}>
                    {businessInquirySectionContent.marketingNotice}
                  </p>
                </div>

                <button className={styles['submitButton']} disabled={isSubmitting} type='submit'>
                  {isSubmitting ? '접수 중...' : businessInquirySectionContent.submitLabel}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {isPrivacyModalOpen ? (
        <div
          className={styles['privacyModalOverlay']}
          onClick={() => {
            setIsPrivacyModalOpen(false);
          }}
        >
          <div
            aria-labelledby='business-inquiry-privacy-modal-title'
            aria-modal='true'
            className={styles['privacyModalPanel']}
            onClick={(event) => {
              event.stopPropagation();
            }}
            role='dialog'
          >
            <div className={styles['privacyModalHeader']}>
              <h3 className={styles['privacyModalTitle']} id='business-inquiry-privacy-modal-title'>
                {businessInquiryPrivacyPolicy.title}
              </h3>
              <button
                aria-label='개인정보처리방침 닫기'
                autoFocus
                className={styles['privacyModalCloseButton']}
                onClick={() => {
                  setIsPrivacyModalOpen(false);
                }}
                type='button'
              >
                ×
              </button>
            </div>

            <div className={styles['privacyModalBody']}>
              <p className={styles['privacyModalEffectiveDate']}>
                시행일: {businessInquiryPrivacyPolicy.effectiveDate}
              </p>

              {businessInquiryPrivacyPolicy.intro.map((paragraph) => {
                return (
                  <p className={styles['privacyModalParagraph']} key={paragraph}>
                    {paragraph}
                  </p>
                );
              })}

              {businessInquiryPrivacyPolicy.sections.map((section) => {
                return (
                  <section className={styles['privacyModalSection']} key={section.id}>
                    <h4 className={styles['privacyModalSectionTitle']}>{section.title}</h4>
                    {section.paragraphs?.map((paragraph) => {
                      return (
                        <p className={styles['privacyModalParagraph']} key={paragraph}>
                          {paragraph}
                        </p>
                      );
                    })}
                    {section.items?.length ? (
                      <ul className={styles['privacyModalList']}>
                        {section.items.map((item) => {
                          return (
                            <li className={styles['privacyModalListItem']} key={item}>
                              {item}
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BusinessInquirySection;

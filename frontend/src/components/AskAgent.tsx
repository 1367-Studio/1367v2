import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { ArrowRight, ArrowUp, ArrowCounterClockwise, X } from '@phosphor-icons/react';
import type { AgentUIMessage } from '../pages/api/agent';

interface Props {
  welcomeMessage?: string;
  suggestedQuestions?: string[];
}

const transport = new DefaultChatTransport<AgentUIMessage>({ api: '/api/agent' });
const STORAGE_KEY = 'ask-agent-messages';
const DEFAULT_WELCOME =
  "Hi, I'm the 1367 Studio agent. Ask me anything about our work, our stack or how we could build your project.";
const DEFAULT_SUGGESTIONS = [
  'What do you build?',
  'Which stack do you use?',
  'Are you a Sanity partner?',
  'How do we start a project?',
];

function loadMessages(): AgentUIMessage[] {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

const textOf = (m: AgentUIMessage) =>
  m.parts.map((p) => (p.type === 'text' ? p.text : '')).join('').trim();

export default function AskAgent({ welcomeMessage, suggestedQuestions }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [dismissedHandoff, setDismissedHandoff] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error, regenerate, setMessages, stop } = useChat<AgentUIMessage>({
    transport,
    messages: loadMessages(),
  });

  const busy = status === 'submitted' || status === 'streaming';
  const suggestions = suggestedQuestions?.length ? suggestedQuestions : DEFAULT_SUGGESTIONS;

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('agent:open', onOpen);
    return () => window.removeEventListener('agent:open', onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (status !== 'ready') return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages, status]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, status]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    sendMessage({ text: t });
    setInput('');
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(input);
    }
  };

  const reset = () => {
    stop();
    setMessages([]);
    setDismissedHandoff(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');

  return (
    <>
      <div
        className={`fixed inset-0 z-[998] bg-black/40 transition-opacity duration-300 md:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-label="Ask Agent"
        aria-hidden={!open}
        inert={!open}
        className={`fixed top-0 right-0 bottom-0 z-[999] flex w-full flex-col bg-[#0d0d0d] font-[Geist] text-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:w-[440px] md:border-l md:border-white/10 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <span className="rounded-full border border-[#f43c00] px-4 py-2 font-[Geist_Mono] text-[12px] uppercase tracking-wide">
            Ask Agent
          </span>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={reset}
                aria-label="New conversation"
                title="New conversation"
                className="cursor-pointer rounded-full p-2 opacity-70 transition-opacity hover:opacity-100"
              >
                <ArrowCounterClockwise size={18} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="cursor-pointer rounded-full p-2 opacity-70 transition-opacity hover:opacity-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-6 pb-6">
          {messages.length === 0 && (
            <div className="pt-6">
              <p className="text-[17px] leading-relaxed text-white/90">{welcomeMessage || DEFAULT_WELCOME}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {suggestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="cursor-pointer rounded-full border border-white/20 px-4 py-2 text-left text-[14px] text-white/80 transition-colors hover:border-white/60 hover:text-white"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) =>
            m.role === 'user' ? (
              <p key={m.id} className="mt-6 rounded-lg bg-white/10 px-4 py-3 text-[15px] leading-relaxed text-white/90 whitespace-pre-wrap">
                {textOf(m)}
              </p>
            ) : (
              <div key={m.id} className="mt-6">
                {textOf(m)
                  .split(/\n{2,}/)
                  .filter(Boolean)
                  .map((para, i) => (
                    <p key={i} className="mb-4 text-[16px] leading-relaxed whitespace-pre-wrap last:mb-0">
                      {para}
                    </p>
                  ))}

                {m.parts.map((p, i) =>
                  p.type === 'tool-showLinks' && p.state === 'output-available' && p.output.links.length > 0 ? (
                    <div key={i} className="mt-5 flex flex-col gap-2">
                      {p.output.links.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          onClick={() => window.innerWidth < 768 && setOpen(false)}
                          className="inline-flex items-center gap-2 font-[Geist_Mono] text-[13px] uppercase tracking-wide text-white/90 transition-colors hover:text-[#f43c00]"
                        >
                          <ArrowRight size={14} />
                          {l.label}
                        </a>
                      ))}
                    </div>
                  ) : null,
                )}

                {m === lastAssistant &&
                  !busy &&
                  dismissedHandoff !== m.id &&
                  m.parts.some((p) => p.type === 'tool-offerHandoff') && (
                    <Handoff messages={messages} onDismiss={() => setDismissedHandoff(m.id)} />
                  )}
              </div>
            ),
          )}

          {status === 'submitted' && (
            <div className="mt-6 flex gap-1" aria-label="Thinking">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          )}

          {error && (
            <div className="mt-6 text-[14px] text-white/70">
              Something went wrong.{' '}
              <button type="button" onClick={() => regenerate()} className="cursor-pointer underline hover:text-white">
                Try again
              </button>
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="p-4">
          <div className="relative rounded-xl border border-white/30 transition-colors focus-within:border-white/70">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask anything about 1367 Studio..."
              rows={3}
              maxLength={2000}
              className="block w-full resize-none bg-transparent px-4 pt-4 pb-12 text-[15px] text-white outline-none placeholder:text-white/40"
            />
            <button
              type="submit"
              disabled={!input.trim() || busy}
              aria-label="Send"
              className="absolute right-3 bottom-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#f43c00] text-white transition-opacity disabled:cursor-default disabled:opacity-30"
            >
              <ArrowUp size={16} weight="bold" />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-white/40">AI answers can be wrong. The team has the final word.</p>
        </form>
      </aside>
    </>
  );
}

function Handoff({ messages, onDismiss }: { messages: AgentUIMessage[]; onDismiss: () => void }) {
  const [step, setStep] = useState<'offer' | 'form' | 'sending' | 'sent' | 'error'>('offer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStep('sending');
    const transcript = messages
      .map((m) => `${m.role === 'user' ? name || 'Visitor' : 'Agent'}: ${textOf(m)}`)
      .join('\n\n');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message: `Sent from the Ask Agent chat.\n\n${transcript}` }),
      });
      setStep(res.ok ? 'sent' : 'error');
    } catch {
      setStep('error');
    }
  };

  const pill =
    'cursor-pointer rounded-full border border-white/30 px-4 py-2 font-[Geist_Mono] text-[12px] uppercase tracking-wide transition-colors hover:border-white';

  if (step === 'sent') {
    return <p className="mt-5 text-[14px] text-white/70">Sent. The team will reply to {email} soon.</p>;
  }

  if (step === 'offer') {
    return (
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={() => setStep('form')} className={pill}>
          Talk to the team
        </button>
        <button type="button" onClick={onDismiss} className={pill}>
          Not now
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-5 flex flex-col gap-2">
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        autoComplete="name"
        className="rounded-lg border border-white/20 bg-transparent px-4 py-2.5 text-[14px] outline-none placeholder:text-white/40 focus:border-white/60"
      />
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        autoComplete="email"
        className="rounded-lg border border-white/20 bg-transparent px-4 py-2.5 text-[14px] outline-none placeholder:text-white/40 focus:border-white/60"
      />
      <p className="text-[12px] text-white/50">We'll send this conversation to the team so you don't have to repeat yourself.</p>
      <div className="flex gap-2">
        <button type="submit" disabled={step === 'sending'} className={`${pill} border-[#f43c00] bg-[#f43c00] disabled:opacity-50`}>
          {step === 'sending' ? 'Sending...' : 'Send to the team'}
        </button>
        <button type="button" onClick={onDismiss} className={pill}>
          Cancel
        </button>
      </div>
      {step === 'error' && <p className="text-[13px] text-white/70">Couldn't send. Please use the contact page instead.</p>}
    </form>
  );
}

import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Certification,
  Education,
  Experience,
  Language,
  LinkItem,
  ProjectItem,
  Skill,
} from "@/lib/matchcv-types";
import { SKILL_LEVELS, newId } from "@/lib/matchcv-types";

type ListProps<T> = { items: T[]; onChange: (items: T[]) => void };

function ItemShell({
  children,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  children: React.ReactNode;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="mb-3 flex justify-end gap-1">
        {onMoveUp ? (
          <Button type="button" variant="ghost" size="icon" onClick={onMoveUp} aria-label="Subir">
            <ArrowUp className="h-4 w-4" />
          </Button>
        ) : null}
        {onMoveDown ? (
          <Button type="button" variant="ghost" size="icon" onClick={onMoveDown} aria-label="Descer">
            <ArrowDown className="h-4 w-4" />
          </Button>
        ) : null}
        <Button type="button" variant="ghost" size="icon" onClick={onRemove} aria-label="Excluir">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
      {children}
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button type="button" variant="outline" onClick={onClick} className="w-full">
      <Plus className="mr-1 h-4 w-4" /> {label}
    </Button>
  );
}

function move<T>(items: T[], from: number, to: number) {
  const copy = [...items];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item as T);
  return copy;
}

export function ExperienceList({ items, onChange }: ListProps<Experience>) {
  const update = (index: number, patch: Partial<Experience>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <ItemShell
          key={item.id}
          onRemove={() => onChange(items.filter((_, i) => i !== index))}
          onMoveUp={index > 0 ? () => onChange(move(items, index, index - 1)) : undefined}
          onMoveDown={
            index < items.length - 1 ? () => onChange(move(items, index, index + 1)) : undefined
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Input
                value={item.company}
                onChange={(e) => update(index, { company: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Cargo</Label>
              <Input
                value={item.position}
                onChange={(e) => update(index, { position: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Início</Label>
              <Input
                placeholder="MM/AAAA"
                value={item.startDate}
                onChange={(e) => update(index, { startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Término</Label>
              <Input
                placeholder="MM/AAAA"
                disabled={item.current}
                value={item.current ? "" : item.endDate}
                onChange={(e) => update(index, { endDate: e.target.value })}
              />
            </div>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <Checkbox
              checked={item.current}
              onCheckedChange={(checked) => update(index, { current: checked === true })}
            />
            Emprego atual
          </label>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                rows={2}
                value={item.description}
                onChange={(e) => update(index, { description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Principais responsabilidades</Label>
              <Textarea
                rows={2}
                value={item.responsibilities}
                onChange={(e) => update(index, { responsibilities: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Resultados e conquistas</Label>
              <Textarea
                rows={2}
                value={item.achievements}
                onChange={(e) => update(index, { achievements: e.target.value })}
              />
            </div>
          </div>
        </ItemShell>
      ))}
      <AddButton
        label="Adicionar experiência"
        onClick={() =>
          onChange([
            ...items,
            {
              id: newId(),
              company: "",
              position: "",
              startDate: "",
              endDate: "",
              current: false,
              description: "",
              responsibilities: "",
              achievements: "",
            },
          ])
        }
      />
    </div>
  );
}

export function EducationList({ items, onChange }: ListProps<Education>) {
  const update = (index: number, patch: Partial<Education>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <ItemShell key={item.id} onRemove={() => onChange(items.filter((_, i) => i !== index))}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Instituição</Label>
              <Input
                value={item.institution}
                onChange={(e) => update(index, { institution: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Curso</Label>
              <Input
                value={item.course}
                onChange={(e) => update(index, { course: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Grau</Label>
              <Input
                placeholder="Técnico, Graduação, Pós..."
                value={item.degree}
                onChange={(e) => update(index, { degree: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Início</Label>
                <Input
                  placeholder="AAAA"
                  value={item.startDate}
                  onChange={(e) => update(index, { startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Término</Label>
                <Input
                  placeholder="AAAA"
                  value={item.endDate}
                  onChange={(e) => update(index, { endDate: e.target.value })}
                />
              </div>
            </div>
          </div>
        </ItemShell>
      ))}
      <AddButton
        label="Adicionar formação"
        onClick={() =>
          onChange([
            ...items,
            {
              id: newId(),
              institution: "",
              course: "",
              degree: "",
              startDate: "",
              endDate: "",
            },
          ])
        }
      />
    </div>
  );
}

export function SkillList({ items, onChange }: ListProps<Skill>) {
  const update = (index: number, patch: Partial<Skill>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-2">
          <Input
            className="flex-1"
            placeholder="Ex.: Excel, SQL, Gestão de estoque"
            value={item.name}
            onChange={(e) => update(index, { name: e.target.value })}
          />
          <Select
            value={item.level}
            onValueChange={(value) => update(index, { level: value as Skill["level"] })}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SKILL_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Excluir"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <AddButton
        label="Adicionar habilidade"
        onClick={() => onChange([...items, { id: newId(), name: "", level: "Intermediário" }])}
      />
    </div>
  );
}

export function LanguageList({ items, onChange }: ListProps<Language>) {
  const update = (index: number, patch: Partial<Language>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-2">
          <Input
            className="flex-1"
            placeholder="Idioma"
            value={item.name}
            onChange={(e) => update(index, { name: e.target.value })}
          />
          <Input
            className="w-48"
            placeholder="Nível"
            value={item.level}
            onChange={(e) => update(index, { level: e.target.value })}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Excluir"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <AddButton
        label="Adicionar idioma"
        onClick={() => onChange([...items, { id: newId(), name: "", level: "" }])}
      />
    </div>
  );
}

export function CertificationList({ items, onChange }: ListProps<Certification>) {
  const update = (index: number, patch: Partial<Certification>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item.id} className="flex flex-col gap-2 md:flex-row">
          <Input
            className="flex-1"
            placeholder="Certificação"
            value={item.name}
            onChange={(e) => update(index, { name: e.target.value })}
          />
          <Input
            className="md:w-56"
            placeholder="Instituição"
            value={item.issuer}
            onChange={(e) => update(index, { issuer: e.target.value })}
          />
          <div className="flex gap-2">
            <Input
              className="w-28"
              placeholder="Ano"
              value={item.year}
              onChange={(e) => update(index, { year: e.target.value })}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Excluir"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
      <AddButton
        label="Adicionar certificação"
        onClick={() => onChange([...items, { id: newId(), name: "", issuer: "", year: "" }])}
      />
    </div>
  );
}

export function ProjectList({ items, onChange }: ListProps<ProjectItem>) {
  const update = (index: number, patch: Partial<ProjectItem>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <ItemShell key={item.id} onRemove={() => onChange(items.filter((_, i) => i !== index))}>
          <div className="space-y-3">
            <Input
              placeholder="Nome do projeto"
              value={item.name}
              onChange={(e) => update(index, { name: e.target.value })}
            />
            <Textarea
              rows={2}
              placeholder="Descrição"
              value={item.description}
              onChange={(e) => update(index, { description: e.target.value })}
            />
            <Input
              placeholder="Link (opcional)"
              value={item.url}
              onChange={(e) => update(index, { url: e.target.value })}
            />
          </div>
        </ItemShell>
      ))}
      <AddButton
        label="Adicionar projeto"
        onClick={() => onChange([...items, { id: newId(), name: "", description: "", url: "" }])}
      />
    </div>
  );
}

export function LinkList({ items, onChange }: ListProps<LinkItem>) {
  const update = (index: number, patch: Partial<LinkItem>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-2">
          <Input
            className="w-40"
            placeholder="LinkedIn"
            value={item.label}
            onChange={(e) => update(index, { label: e.target.value })}
          />
          <Input
            className="flex-1"
            placeholder="https://"
            value={item.url}
            onChange={(e) => update(index, { url: e.target.value })}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Excluir"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <AddButton
        label="Adicionar link"
        onClick={() => onChange([...items, { id: newId(), label: "", url: "" }])}
      />
    </div>
  );
}

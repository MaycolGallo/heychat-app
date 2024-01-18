"use client";

import * as React from "react";
import {
  Check,
  ChevronsUpDown,
  Edit2,
  Loader,
  LucideMoreVertical,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useActionState } from "@/lib/use-form-state";
import { change } from "@/app/actions/change";
import { ToastError, ToastSuccess } from "../toasts/toasts";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "./drawer";

// FIXME: https://twitter.com/lemcii/status/1659649371162419202?s=46&t=gqNnMIjMWXiG2Rbrr5gT6g
// Removing states would help maybe?

type Framework = Record<"value" | "label" | "color", string>;

const FRAMEWORKS = [
  {
    value: "next.js",
    label: "Next.js",
    color: "#ef4444",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
    color: "#eab308",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
    color: "#22c55e",
  },
  {
    value: "remix",
    label: "Remix",
    color: "#06b6d4",
  },
  {
    value: "astro",
    label: "Astro",
    color: "#3b82f6",
  },
  {
    value: "wordpress",
    label: "WordPress",
    color: "#8b5cf6",
  },
] satisfies Framework[];

export function FancyBox({
  category,
  categories,
  contactId,
}: {
  category: string;
  categories: string[];
  contactId: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [frameworks, setFrameworks] = React.useState(categories);
  const [openCombobox, setOpenCombobox] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [selectedValues, setSelectedValues] = React.useState(category);
  const [changeCat, { loading }] = useActionState(change);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const onSubmit = React.useCallback(async () => {
    const res = await changeCat(selectedValues, contactId);
    if (res.data?.success) {
      ToastSuccess({ message: "Categoria cambiada." });
      setOpenCombobox(false);
    } else if (res.data?.error) {
      ToastError({ message: "Error al cambiar categoria." });
    }
  }, [changeCat, contactId, selectedValues]);

  const createFramework = (name: string) => {
    const newFramework = {
      value: name.toLowerCase(),
      label: name,
      color: "#ffffff",
    };
    setFrameworks((prev) => [...prev, name.toLowerCase()]);
    setSelectedValues(name.toLowerCase());
  };

  const toggleFramework = (framework: string) => {
    // setSelectedValues((currentFrameworks) =>
    //   !currentFrameworks.includes(framework)
    //     ? [...currentFrameworks, framework]
    //     : currentFrameworks.filter((l) => l.value !== framework.value)
    // );
    setSelectedValues(framework);
    inputRef?.current?.focus();
  };

  const onComboboxOpenChange = (value: boolean) => {
    inputRef.current?.blur(); // HACK: otherwise, would scroll automatically to the bottom of page
    setOpenCombobox(value);
  };

  if (!isDesktop) {
    return (
      <Drawer open={openCombobox} onOpenChange={onComboboxOpenChange}>
        <DrawerTrigger>
          <LucideMoreVertical className="h-4 w-4" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Cambiar categoria</DrawerTitle>
          </DrawerHeader>
          <Command loop>
            <CommandInput
              ref={inputRef}
              placeholder="Buscar Categoria..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandGroup className="max-h-[145px] py-1 overflow-auto">
              {frameworks.map((framework) => {
                // const isActive = selectedValues.includes(framework);
                return (
                  <CommandItem
                    key={framework}
                    value={framework}
                    onSelect={() => toggleFramework(framework)}
                    className="flex items-center justify-between"
                  >
                    {/* <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        // isActive ? "opacity-100" : "opacity-0"
                      )}
                    /> */}
                    <div className="flex-1">{framework}</div>
                    {selectedValues === framework && <Check className="mr-2 h-4 w-4" />}

                    {/* <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: framework.color }}
                    /> */}
                  </CommandItem>
                );
              })}
              <CommandItemCreate
                onSelect={() => createFramework(inputValue)}
                {...{ inputValue, frameworks }}
              />
            </CommandGroup>
            <CommandSeparator alwaysRender />
            <CommandGroup>
              <SaveButton
                selected={selectedValues}
                frameworks={categories}
                inputValue={category}
                uniqueValue={inputValue}
                onSelect={onSubmit}
                loading={loading}
                // onSelect={() => setOpenCombobox(false)}
              />
            </CommandGroup>
          </Command>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div className="max-w-[200px] xl:max-w-[150px]">
      <Popover open={openCombobox} onOpenChange={onComboboxOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCombobox}
            className="w-[200px] xl:w-[150px] justify-between text-foreground"
          >
            <span className="truncate">
              {!selectedValues ? "Select labels" : selectedValues}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command loop>
            <CommandInput
              ref={inputRef}
              placeholder="Buscar categoria..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandGroup  className="max-h-[145px] py-1 overflow-auto">
              {frameworks.map((framework) => {
                // const isActive = selectedValues.includes(framework);
                return (
                  <CommandItem
                    key={framework}
                    value={framework}
                    // aria-selected={selectedValues === framework}
                    aria-selected={"false"}
                    className="flex justify-between items-center"
                    onSelect={() => toggleFramework(framework)}
                  >
                    {/* <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        // isActive ? "opacity-100" : "opacity-0"
                      )}
                    /> */}
                    <div className="flex-1">{framework}</div>
                    {selectedValues === framework && <Check className="mr-2 h-4 w-4" />}
                    {/* <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: framework.color }}
                    /> */}
                  </CommandItem>
                );
              })}
              <CommandItemCreate
                onSelect={() => createFramework(inputValue)}
                {...{ inputValue, frameworks }}
              />
            </CommandGroup>
            <CommandSeparator alwaysRender />
            <CommandGroup>
              <SaveButton
                selected={selectedValues}
                frameworks={categories}
                inputValue={category}
                uniqueValue={inputValue}
                onSelect={onSubmit}
                loading={loading}
                // onSelect={() => setOpenCombobox(false)}
              />
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function SaveButton({
  inputValue,
  uniqueValue,
  frameworks,
  selected,
  onSelect,
  loading,
}: {
  inputValue: string;
  uniqueValue: string;
  selected: string | null;
  frameworks: string[];
  onSelect: () => void;
  loading: boolean;
}) {
  const hasNoFramework = !frameworks
    .map((value) => value)
    .includes(`${inputValue.trim().toLowerCase()}`);
  const render = inputValue !== "" && selected !== inputValue;

  return (
    // <Button disabled={!render} type="submit" className="w-full">
    //   Save
    // </Button>
    <CommandItem
      value={`:${uniqueValue}:`}
      className={`w-full justify-center ${
        !render ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      disabled={!render}
      onSelect={onSelect}
    >
      Guardar {loading ? <Loader className="animate-spin h-4 w-4" /> : null}
    </CommandItem>
  );
}

const CommandItemCreate = ({
  inputValue,
  frameworks,
  onSelect,
}: {
  inputValue: string;
  frameworks: string[];
  onSelect: () => void;
}) => {
  const hasNoFramework = !frameworks
    .map((value) => value)
    .includes(`${inputValue.trim().toLowerCase()}`);

  const render = inputValue !== "" && hasNoFramework;

  if (!render) return null;

  // BUG: whenever a space is appended, the Create-Button will not be shown.
  return (
    <CommandItem
      key={`${inputValue}`}
      value={`${inputValue}`}
      className="text-xs text-muted-foreground"
      onSelect={onSelect}
    >
      <div className={cn("mr-2 h-4 w-4")} />
      Crear &quot;{inputValue}&quot;
    </CommandItem>
  );
};

// const DialogListItem = ({
//   value,
//   label,
//   color,
//   onSubmit,
//   onDelete,
// }: Framework & {
//   onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
//   onDelete: () => void;
// }) => {
//   const inputRef = React.useRef<HTMLInputElement>(null);
//   const [accordionValue, setAccordionValue] = React.useState<string>("");
//   const [inputValue, setInputValue] = React.useState<string>(label);
//   const [colorValue, setColorValue] = React.useState<string>(color);
//   const disabled = label === inputValue && color === colorValue;

//   React.useEffect(() => {
//     if (accordionValue !== "") {
//       inputRef.current?.focus();
//     }
//   }, [accordionValue]);

//   return (
//     <Accordion
//       key={value}
//       type="single"
//       collapsible
//       value={accordionValue}
//       onValueChange={setAccordionValue}
//     >
//       <AccordionItem value={value}>
//         <div className="flex justify-between items-center">
//           <div>
//             <Badge variant="outline" style={badgeStyle(color)}>
//               {label}
//             </Badge>
//           </div>
//           <div className="flex items-center gap-4">
//             <AccordionTrigger>Edit</AccordionTrigger>
//             <AlertDialog>
//               <AlertDialogTrigger asChild>
//                 {/* REMINDER: size="xs" */}
//                 <Button variant="destructive" size="xs">
//                   Delete
//                 </Button>
//               </AlertDialogTrigger>
//               <AlertDialogContent>
//                 <AlertDialogHeader>
//                   <AlertDialogTitle>Are you sure sure?</AlertDialogTitle>
//                   <AlertDialogDescription>
//                     You are about to delete the label{" "}
//                     <Badge variant="outline" style={badgeStyle(color)}>
//                       {label}
//                     </Badge>{" "}
//                     .
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>
//                 <AlertDialogFooter>
//                   <AlertDialogCancel>Cancel</AlertDialogCancel>
//                   <AlertDialogAction onClick={onDelete}>
//                     Delete
//                   </AlertDialogAction>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//           </div>
//         </div>
//         <AccordionContent>
//           <form
//             className="flex items-end gap-4"
//             onSubmit={(e) => {
//               onSubmit(e);
//               setAccordionValue("");
//             }}
//           >
//             <div className="w-full gap-3 grid">
//               <Label htmlFor="name">Label name</Label>
//               <Input
//                 ref={inputRef}
//                 id="name"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 className="h-8"
//               />
//             </div>
//             <div className="gap-3 grid">
//               <Label htmlFor="color">Color</Label>
//               <Input
//                 id="color"
//                 type="color"
//                 value={colorValue}
//                 onChange={(e) => setColorValue(e.target.value)}
//                 className="h-8 px-2 py-1"
//               />
//             </div>
//             {/* REMINDER: size="xs" */}
//             <Button type="submit" disabled={disabled} size="xs">
//               Save
//             </Button>
//           </form>
//         </AccordionContent>
//       </AccordionItem>
//     </Accordion>
//   );
// };

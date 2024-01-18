"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { useViewportSize } from "@/lib/useViewport";
import { CheckIcon, ListFilter } from "lucide-react";
import { Children, useState } from "react";

type Props = {
  filters: string[];
  children?: (selectedFilter: string | null) => React.ReactNode;
  setSelectedFilter: (filter: string | null) => void;
  selectedFilter: string | null;
};

export function Filters(props: Props) {
  const { filters, setSelectedFilter, selectedFilter } = props;
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("( min-width: 768px )");
  // const [categories, setCategories] = useState(filters);
  //   const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  if (!isDesktop) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <div className="absolute top-[-50px] right-0">
            <Button variant="ghost" onClick={() => setOpen(!open)}>
              <ListFilter className="w-4 h-4" />
            </Button>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <FilterList
            setOpen={setOpen}
            setSelectedFilter={setSelectedFilter}
            categories={filters}
            selected={selectedFilter}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div className="absolute top-[-50px] right-0">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" onClick={() => setOpen(!open)}>
            <ListFilter className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="p-0 w-44">
          <FilterList
            setOpen={setOpen}
            setSelectedFilter={setSelectedFilter}
            categories={filters}
            selected={selectedFilter}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function FilterList({
  setOpen,
  setSelectedFilter,
  categories,
  selected
}: {
  setOpen: (open: boolean) => void;
  setSelectedFilter: (status: string | null) => void;
  categories: string[];
  selected: string | null;
}) {
  return (
    <Command>
      <CommandInput placeholder="Buscar" />
      <CommandList>
        <CommandEmpty>Sin Resultados</CommandEmpty>
      </CommandList>
      <CommandGroup>
        <CommandItem className="flex justify-between" onSelect={() => setSelectedFilter(null)}>
          Todos
          {selected === null && <CheckIcon className="w-4 h-4" />}
        </CommandItem>
        {categories.map((category) => (
          <CommandItem
            key={category}
            value={category}
            onSelect={() => {
              setSelectedFilter(categories.find((c) => c === category) || null);
              setOpen(false);
            }}
            className="truncate flex items-center justify-between"
          >
            {category}
            {category === selected && <CheckIcon className="w-4 h-4" />}
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
}

type FunctionAsChildProps = {
  children?: (count: number, increment: () => void) => React.ReactNode;
};

const FunctionAsChild: React.FC<FunctionAsChildProps> = ({ children }) => {
  const [count, setCount] = useState<number>(0);

  const increment = (): void => {
    setCount(count + 1);
  };

  if (children) {
    children(count, increment);
  }

  return <div>meow</div>;
};

const App = () => {
  return (
    <FunctionAsChild>
      {(count, increment) => (
        <div>
          {/* Display the current count */}
          <p>Count: {count}</p>
          {/* Add a button to increment the count */}
          <button onClick={increment}>Increment</button>
        </div>
      )}
    </FunctionAsChild>
  );
};

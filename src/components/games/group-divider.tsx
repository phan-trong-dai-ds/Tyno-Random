"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/context/language-context";
import { useSound } from "@/context/sound-context";
import { Confetti } from "@/components/effects/confetti";
import { useToast } from "@/hooks/use-toast";
import { Users, Shuffle, ArrowDownAZ, Trash2, Crown, Sparkles, RefreshCw, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Group {
  id: string;
  name: string;
  members: string[];
  leader?: string;
  coLeader?: string;
}

export function GroupDivider() {
  const { translations } = useLanguage();
  const { playSound } = useSound();
  const { toast } = useToast();

  const [namesInput, setNamesInput] = useState(
    "Alice\nBob\nCharlie\nDavid\nEve\nFrank\nGrace\nHenry\nIvy\nJack"
  );
  const [namesList, setNamesList] = useState<string[]>([]);
  const [mode, setMode] = useState<"teams" | "members">("teams");
  const [teamsCount, setTeamsCount] = useState(2);
  const [membersCount, setMembersCount] = useState(3);
  const [assignLeader, setAssignLeader] = useState(false);
  const [assignCoLeader, setAssignCoLeader] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDividing, setIsDividing] = useState(false);

  // Sync raw input to names array
  useEffect(() => {
    const parsed = namesInput
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
    setNamesList(parsed);
  }, [namesInput]);

  const handleShuffleNames = () => {
    const shuffled = [...namesList].sort(() => Math.random() - 0.5);
    setNamesInput(shuffled.join("\n"));
  };

  const handleSortNames = () => {
    const sorted = [...namesList].sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    );
    setNamesInput(sorted.join("\n"));
  };

  const handleClearNames = () => {
    setNamesInput("");
    setGroups([]);
  };

  // Co-leader checkbox handler to maintain the constraint
  const handleCoLeaderChange = (checked: boolean) => {
    setAssignCoLeader(checked);
    if (checked) {
      setAssignLeader(true);
    }
  };

  // Main grouping algorithm
  const handleDivide = useCallback(() => {
    if (namesList.length === 0) {
      toast({
        title: translations.noNamesToDivideErrorTitle as string,
        description: translations.noNamesToDivideErrorDescription as string,
        variant: "destructive",
      });
      return;
    }

    const count = mode === "teams" ? teamsCount : membersCount;
    if (count < 1) {
      toast({
        title: translations.invalidInputErrorTitle as string,
        description: translations.invalidInputErrorDescription as string,
        variant: "destructive",
      });
      return;
    }

    setIsDividing(true);
    setGroups([]);
    setShowConfetti(false);

    // Add a slight delay for realistic processing feel
    setTimeout(() => {
      const shuffled = [...namesList].sort(() => Math.random() - 0.5);
      const calculatedGroups: string[][] = [];

      if (mode === "teams") {
        const numTeams = Math.min(count, shuffled.length);
        for (let i = 0; i < numTeams; i++) {
          calculatedGroups.push([]);
        }
        shuffled.forEach((name, index) => {
          calculatedGroups[index % numTeams].push(name);
        });
      } else {
        const membersPerTeam = count;
        const numTeams = Math.ceil(shuffled.length / membersPerTeam);
        for (let i = 0; i < numTeams; i++) {
          const start = i * membersPerTeam;
          const end = start + membersPerTeam;
          calculatedGroups.push(shuffled.slice(start, end));
        }
      }

      // Assign leaders and co-leaders
      const finalGroups = calculatedGroups.map((members, groupIndex) => {
        let leader: string | undefined;
        let coLeader: string | undefined;
        const pool = [...members];

        if (assignLeader && pool.length > 0) {
          const leaderIdx = Math.floor(Math.random() * pool.length);
          leader = pool[leaderIdx];
          pool.splice(leaderIdx, 1);
        }

        if (assignCoLeader && pool.length > 0) {
          const coLeaderIdx = Math.floor(Math.random() * pool.length);
          coLeader = pool[coLeaderIdx];
          pool.splice(coLeaderIdx, 1);
        }

        // Put leader and co-leader at the top of the group members list
        const orderedMembers: string[] = [];
        if (leader) orderedMembers.push(leader);
        if (coLeader) orderedMembers.push(coLeader);
        orderedMembers.push(...pool);

        const groupNum = groupIndex + 1;
        const groupName = typeof translations.groupNameLabel === "function"
          ? (translations.groupNameLabel as (idx: number) => string)(groupNum)
          : `Group ${groupNum}`;

        return {
          id: `group-${groupIndex}`,
          name: groupName,
          members: orderedMembers,
          leader,
          coLeader,
        };
      });

      // Filter empty groups if any
      const nonEmptyGroups = finalGroups.filter((g) => g.members.length > 0);

      setGroups(nonEmptyGroups);
      setIsDividing(false);
      setShowConfetti(true);
      playSound("/sounds/applause.mp3");
      setTimeout(() => setShowConfetti(false), 7500);
    }, 800);
  }, [
    namesList,
    mode,
    teamsCount,
    membersCount,
    assignLeader,
    assignCoLeader,
    toast,
    translations,
    playSound,
  ]);

  const itemsEnteredText = typeof translations.namesEnteredSuffix === "function"
    ? (translations.namesEnteredSuffix as (count: number) => string)(namesList.length)
    : `${namesList.length} ${translations.namesEnteredSuffix}`;

  const isLeaderCheckboxDisabled = assignCoLeader;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {showConfetti && <Confetti />}

      <Card className="bg-card/60 backdrop-blur-md border border-border/80 shadow-xl overflow-hidden">

        <CardContent className="p-6 sm:p-8 space-y-8">
          {/* Input list */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="namesInput" className="text-base font-semibold text-foreground">
                {translations.enterNamesLabel as string}
              </Label>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleShuffleNames} disabled={isDividing || namesList.length < 2} className="h-8 w-8 p-0" title={translations.shuffleNamesButtonLabel as string}>
                  <Shuffle className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleSortNames} disabled={isDividing || namesList.length < 2} className="h-8 w-8 p-0" title={translations.sortNamesButtonLabel as string}>
                  <ArrowDownAZ className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearNames} disabled={isDividing || namesList.length === 0} className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10" title={translations.clearListButton as string}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="border border-border/60 rounded-xl overflow-hidden shadow-inner">
              <Textarea
                id="namesInput"
                value={namesInput}
                onChange={(e) => setNamesInput(e.target.value)}
                rows={8}
                className="font-mono text-base bg-background/50 border-0 focus-visible:ring-0 resize-y p-4"
                placeholder={translations.namesPlaceholder as string}
                disabled={isDividing}
              />
            </div>
            <p className="text-sm font-medium text-primary/80 pt-1">{itemsEnteredText}</p>
          </div>

          {/* Division Modes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Mode: Teams */}
            <div 
              className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col gap-4 ${mode === "teams" ? "border-primary bg-primary/5 shadow-md" : "border-border/60 bg-muted/20 hover:border-primary/50"}`}
              onClick={() => !isDividing && setMode("teams")}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${mode === "teams" ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40 bg-background"}`}>
                  {mode === "teams" && <span className="text-xs font-bold">✓</span>}
                </div>
                <Label className="text-base font-bold cursor-pointer">{translations.divideByTeams as string}</Label>
              </div>
              <div className="pl-9">
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={teamsCount}
                  onChange={(e) => {
                    setMode("teams");
                    setTeamsCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)));
                  }}
                  disabled={isDividing}
                  className="bg-background font-semibold text-lg max-w-[120px]"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Mode: Members */}
            <div 
              className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col gap-4 ${mode === "members" ? "border-primary bg-primary/5 shadow-md" : "border-border/60 bg-muted/20 hover:border-primary/50"}`}
              onClick={() => !isDividing && setMode("members")}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${mode === "members" ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40 bg-background"}`}>
                  {mode === "members" && <span className="text-xs font-bold">✓</span>}
                </div>
                <Label className="text-base font-bold cursor-pointer">{translations.divideByMembers as string}</Label>
              </div>
              <div className="pl-9">
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={membersCount}
                  onChange={(e) => {
                    setMode("members");
                    setMembersCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)));
                  }}
                  disabled={isDividing}
                  className="bg-background font-semibold text-lg max-w-[120px]"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>

          {/* Options Checkboxes */}
          <div className="border-2 border-border/60 bg-muted/10 rounded-xl p-5 space-y-4">
            {/* Option 1: Leader */}
            <div
              className={`flex items-center space-x-3 transition-opacity duration-300 ${
                isLeaderCheckboxDisabled ? "opacity-60 select-none" : ""
              }`}
            >
              <Checkbox
                id="assignLeader"
                checked={assignLeader}
                onCheckedChange={(checked) => setAssignLeader(!!checked)}
                disabled={isLeaderCheckboxDisabled || isDividing}
                className="w-5 h-5 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
              />
              <Label
                htmlFor="assignLeader"
                className={`text-base font-medium leading-none ${
                  isLeaderCheckboxDisabled || isDividing ? "text-muted-foreground" : "cursor-pointer"
                }`}
              >
                {translations.optionRandomLeader as string}
              </Label>
            </div>

            {/* Option 2: Co-leader */}
            <div className="flex items-center space-x-3">
              <Checkbox
                id="assignCoLeader"
                checked={assignCoLeader}
                onCheckedChange={(checked) => handleCoLeaderChange(!!checked)}
                disabled={isDividing}
                className="w-5 h-5 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
              />
              <Label
                htmlFor="assignCoLeader"
                className={`text-base font-medium leading-none flex items-center flex-wrap gap-2 ${
                  isDividing ? "cursor-not-allowed text-muted-foreground" : "cursor-pointer"
                }`}
              >
                {translations.optionRandomCoLeader as string}
                <span className="text-sm font-normal text-muted-foreground">
                  {translations.optionRandomCoLeaderNote as string}
                </span>
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleDivide}
            disabled={isDividing || namesList.length === 0}
            size="lg"
            className="w-full h-14 text-lg font-bold shadow-lg transition-transform duration-100 hover:scale-[1.01] active:scale-[0.99]"
          >
            {isDividing ? (
              <>
                <RefreshCw className="mr-2 h-6 w-6 animate-spin" />
                {translations.dividingButton as string}
              </>
            ) : (
              <>
                <Users className="mr-2 h-6 w-6" />
                {translations.divideButton as string}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Grid */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          {groups.length === 0 ? (
            <motion.div
              key="empty-placeholder"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full flex flex-col items-center justify-center border-2 border-dashed border-border/80 rounded-2xl p-12 text-center min-h-[250px] bg-card/40 backdrop-blur-sm"
            >
              <div className="p-4 rounded-full bg-muted/60 border border-border/80 text-muted-foreground mb-4">
                <Users className="w-12 h-12 opacity-40" />
              </div>
              <h3 className="text-lg font-bold text-muted-foreground/80 mb-1">
                {typeof translations.readyToDivideTitle === "string" ? translations.readyToDivideTitle : "Ready to Divide"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {typeof translations.readyToDivideDescription === "string" ? translations.readyToDivideDescription : "Add members, choose a dividing mode, and click the Divide button to see the random groups."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="groups-result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
            >
              {groups.map((group, groupIdx) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIdx * 0.08, duration: 0.3 }}
                >
                  <Card className="overflow-hidden border border-border/80 shadow-md h-full bg-card/45 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                    {/* Group Header */}
                    <div className="px-4 py-3 bg-primary/5 border-b border-border/60 flex justify-between items-center">
                      <span className="font-extrabold text-base text-foreground tracking-tight">
                        {group.name}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-muted text-muted-foreground rounded-full border border-border/40">
                        {group.members.length}
                      </span>
                    </div>

                    {/* Group Members List */}
                    <CardContent className="p-4">
                      <ul className="space-y-2">
                        {group.members.map((member, index) => {
                          const isLeader = member === group.leader;
                          const isCoLeader = member === group.coLeader;

                          return (
                            <li
                              key={`${group.id}-${member}-${index}`}
                              className={`flex items-center gap-2 p-2 rounded-lg border text-sm ${
                                isLeader
                                  ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-300 font-bold"
                                  : isCoLeader
                                  ? "bg-sky-500/10 border-sky-500/30 text-sky-900 dark:text-sky-300 font-bold"
                                  : "bg-background/40 border-border/40 text-foreground"
                              }`}
                            >
                              {isLeader && (
                                <Crown className="w-4 h-4 text-amber-500 shrink-0 fill-amber-500" />
                              )}
                              {isCoLeader && (
                                <Sparkles className="w-4 h-4 text-sky-400 shrink-0 fill-sky-400" />
                              )}
                              {!isLeader && !isCoLeader && (
                                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 ml-1 shrink-0" />
                              )}
                              <span className="truncate">{member}</span>

                              {/* Badges */}
                              {isLeader && (
                                <span className="ml-auto text-[10px] uppercase font-extrabold px-1.5 py-0.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded">
                                  {translations.leaderLabel as string}
                                </span>
                              )}
                              {isCoLeader && (
                                <span className="ml-auto text-[10px] uppercase font-extrabold px-1.5 py-0.5 bg-sky-500/20 text-sky-600 dark:text-sky-400 rounded">
                                  {translations.coLeaderLabel as string}
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { ABILITY_TARGETS } from '../constants/abilities';
import { toast } from 'react-hot-toast';

export const COMPOUNDS = {
  COMPOUND_V: {
    name: "Compound V",
    origin: "The Boys",
    effects: ["Laser Eyes", "Electric Aura", "Fire Aura"],
    color: "#0000ff",
    basePrice: 2500,
    cryptoTrigger: "bitcoin",
    active: false
  },
  SUPER_SOLDIER_SERUM: {
    name: "Super Soldier Serum",
    origin: "Captain America",
    effects: ["Enhanced Strength", "Shield Throwing", "Agility"],
    color: "#0066cc",
    basePrice: 2000,
    cryptoTrigger: "ethereum",
    active: false
  },
  
  TITAN_SERUM: {
    name: "Titan Serum",
    origin: "Attack on Titan",
    effects: ["Size Increase", "Regeneration"],
    color: "#ff4d4d",
    basePrice: 1500,
    cryptoTrigger: "ethereum",
    active: false
  },
  /*
  */
  VENOM_SYMBIOTE: {
    name: "Venom Symbiote",
    origin: "Spider-Man",
    effects: ["Web Slinging", "Growing Tongue", "Enhanced Strength", "Shapeshifting"],
    color: "#000000",
    basePrice: 2800,    
    cryptoTrigger: "dogecoin",
    active: false
  },
  POLYJUICE_POTION: {
    name: "Polyjuice Potion",
    origin: "Harry Potter",
    effects: ["Shapeshifting", "Ability Mimicking", "Temporary Transformation"],
    color: "#8b5dc7",
    basePrice: 2300,
    cryptoTrigger: "ripple",
    active: false
  },
  LIZARD_SERUM: {
    name: "Lizard Serum",
    origin: "Spider-Man",
    effects: ["Speed Increase", "Regeneration", "Mutation", "Size Increase"],
    color: "#2a5c3c",
    basePrice: 2000,
    cryptoTrigger: "unknown",
    active: false
  },
  THE_GRASSES: {
    name: "Trial of the Grasses",
    origin: "The Witcher",
    effects: ["Igni", "Yrden", "Quen", "Axii", "Aard"],
    color: "#ffd700",
    basePrice: 2200,
    cryptoTrigger: "ethereum",
    active: false
  },
  PLASMID: {
    name: "Plasmid",
    origin: "Bioshock",
    effects: ["Elemental Powers", "Genetic Modification"],
    color: "#00ffff",
    basePrice: 1800,
    cryptoTrigger: "cardano",
    active: false
  },
  T_VIRUS: {
    name: "T-Virus",
    origin: "Resident Evil",
    effects: ["Mutation", "Regeneration", "Strength"],
    color: "#40ff00",
    basePrice: 1200,
    cryptoTrigger: "dogecoin",
    active: false
  },
  GAMMA_RADIATION: {
    name: "Gamma Radiation",
    origin: "The Incredible Hulk",
    effects: ["Size Increase", "Strength", "Rage"],
    color: "#00ff00",
    basePrice: 2500,
    cryptoTrigger: "bitcoin",
    active: false
  },
  EXTREMIS_VIRUS: {
    name: "Extremis Virus",
    origin: "Iron Man",
    effects: ["Regeneration", "Enhanced Strength", "Heat Generation", "Bio-electricity"],
    color: "#ff4400",
    basePrice: 3000,
    cryptoTrigger: "unknown",
    active: false
  },
  MIRAKURU: {
    name: "Mirakuru",
    origin: "Arrow",
    effects: ["Enhanced Strength", "Regeneration", "Increased Aggression", "Pain Resistance"],
    color: "#800020",
    basePrice: 2500,
    cryptoTrigger: "unknown",
    active: false
  },
  OZ_FORMULA: {
    name: "OZ Formula",
    origin: "Spider-Man",
    effects: ["Enhanced Strength", "Increased Intelligence", "Insanity", "Physical Mutation"],
    color: "#50C878",
    basePrice: 2800,
    cryptoTrigger: "unknown",
    active: false
  },
  T_VIRUS: {
    name: "T-Virus",
    origin: "Resident Evil",
    effects: ["Mutation", "Enhanced Strength", "Regeneration", "Viral Spread"],
    color: "#800080",
    basePrice: 2700,
    cryptoTrigger: "unknown",
    active: false
  },
  GAMMA_RADIATION: {
    name: "Gamma Radiation",
    origin: "The Incredible Hulk",
    effects: ["Massive Size Increase", "Radiation Emission", "Regeneration", "Anger Enhancement"],
    color: "#39FF14",
    basePrice: 3500,
    cryptoTrigger: "unknown",
    active: false
  },
  PLASMID: {
    name: "Plasmid",
    origin: "BioShock",
    effects: ["Genetic Modification", "Element Control", "Neural Enhancement", "ADAM Dependency"],
    color: "#4169E1",
    basePrice: 2900,
    cryptoTrigger: "unknown",
    active: false
  }
};

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const SAFE_MARGIN = 50; // Keep rat this many pixels away from borders

export class Rat {
  constructor(id) {
    this.id = id;
    this.name = `RAT-${String(id).padStart(4, '0')}`;
    this.health = 100;
    this.compound = null;
    this.dosage = 0;
    this.position = {
      x: Math.random() * 800,
      y: Math.random() * 600,
      targetX: null,
      targetY: null,
      startX: null,
      startY: null,
      moveStartTime: null,
      moveDuration: 500 // 0.5 seconds in milliseconds
    };
    const baseVelocity = 0.2;
    this.velocity = {
      x: (Math.random() - 0.5) * baseVelocity,
      y: (Math.random() - 0.5) * baseVelocity
    };
    this.mutations = [];
    this.size = 10;
    this.speed = 1;
    this.glowIntensity = 1;
    this.webPoint = null;
    this.isWebSlinging = false;
    this.tongueLength = 0;
    this.lastLaserTime = 0;
    this.isFireingLaser = false;
    this.capeAngle = 0;
    this.lastAttackTime = 0;
    this.isElectricAura = false;  // Alternates between laser and electric aura
    this.isAuraActive = false;
    this.isFireAuraActive = false;
    this.currentAttackState = 2; // 0: laser, 1: electric, 2: fire
    this.transformTarget = null;
    this.transformStartTime = null;
    this.originalCompound = null;
    this.isTransformed = false;
    this.isThrowingShield = false;
    this.shieldPosition = null;
    this.shieldAngle = 0;
    this.shieldReturnProgress = 0;
    this.lastShieldThrow = 0;
    this.currentSign = 0; // 0: Aard, 1: Igni, 2: Yrden, 3: Quen, 4: Axii
    this.lastSignTime = 0;
    this.isSignActive = false;
    this.signPosition = null;
    this.signScale = 0;
    this.signRotation = 0;
    this.active = false;
    this.highestMarketCap = 0;  // Track highest market cap reached
    this.unlockedAbilities = {
      laser: true,
      fire: false,
      electric: false,
      strength: true,
      shield: true,
      agility: false,
      size: false,
      regeneration: false,
      web: true,
      tongue: false,
      venomStrength: false,
      shape: false,
      shapeshift_venom: true,
      shapeshift_captain: false,
      shapeshift_lizard: false,
      shapeshift_witcher: false,
      shapeshift_compound_v: false,
      shapeshift_titan: false,
      mimic: true,
      transform: true,
      speed: true,
      mutation: false,
      lizardSize: false,
      igni: true,
      yrden: false,
      quen: false,
      axii: false,
      aard: false
    };
    this.initialSize = 10;
    this.maxSizeMultiplier = 2.5;
    this.growthRate = 0.5; // Increased for more visible growth
    this.lastGrowthTime = Date.now();
    this.maxTongueLength = 2; // 2 centimeters max
    this.tongueGrowthRate = 0.002; // Slow growth rate
    this.lastTongueGrowthTime = Date.now();
    this.isInitialLoad = true;
    this.attackCooldown = 2000; // 2 seconds between attacks
    this.currentAttackType = 0; // 0: Laser, 1: Electric, 2: Fire
  }

  static fromState(state, marketData = null) {
    const rat = new Rat(state.id);
    const originalVelocity = state.velocity;
    Object.assign(rat, state);
    
    if (marketData && rat.compound) {
      rat.applyCompoundEffects(marketData);
      rat.velocity = originalVelocity;
    }
    return rat;
  }

  applyCompoundEffects(marketData) {
    const marketCapMultiplier = Math.min(marketData.highestMarketCap / 1e9, 1);
    const scaledMarketCap = marketData.highestMarketCap;
    
    // Store previous unlock states
    const previousUnlocks = { ...this.unlockedAbilities };
    const shouldShowToast = !this.isInitialLoad;

    // Apply compound-specific effects
    switch(this.compound) {
      case 'COMPOUND_V':
        if (!previousUnlocks.fire && marketData.highestMarketCap >= ABILITY_TARGETS.COMPOUND_V.FIRE.target) {
          this.unlockedAbilities.fire = true;
          shouldShowToast && toast.success(`RAT_${this.id + 1} [COMPOUND V] unlocked: Fire Ability`);
        }
        if (!previousUnlocks.electric && marketData.highestMarketCap >= ABILITY_TARGETS.COMPOUND_V.ELECTRIC.target) {
          this.unlockedAbilities.electric = true;
          shouldShowToast && toast.success(`RAT_${this.id + 1} [COMPOUND V] unlocked: Electric Ability`);
        }
        break;
      case 'VENOM_SYMBIOTE':
        this.size = 10 + (marketCapMultiplier * this.dosage / 2);
        this.isWebSlinging = true;
        
        if (!previousUnlocks.tongue && scaledMarketCap >= ABILITY_TARGETS.VENOM_SYMBIOTE.TONGUE.target) {
          this.unlockedAbilities.tongue = true;
          shouldShowToast && toast.success(`RAT_${this.id + 1} [VENOM] unlocked: Tongue Ability`);
          if (!this.tongueLength) {
            this.tongueLength = 0;
          }
        }
        
        if (!previousUnlocks.venomStrength && scaledMarketCap >= ABILITY_TARGETS.VENOM_SYMBIOTE.STRENGTH.target) {
          this.unlockedAbilities.venomStrength = true;
          shouldShowToast && toast.success(`RAT_${this.id + 1} [VENOM] unlocked: Strength Ability`);
        }
        break;
      case 'POLYJUICE_POTION':
        if (!this.isTransformed) {
          this.size = 10 + (marketCapMultiplier * this.dosage / 2);
        }
        if (!previousUnlocks.shapeshift_captain && marketData.highestMarketCap >= ABILITY_TARGETS.POLYJUICE_POTION.SHAPESHIFT_CAPTAIN.target) {
          this.unlockedAbilities.shapeshift_captain = true;
          shouldShowToast && toast.success(`RAT_${this.id + 1} [POLYJUICE] unlocked: Captain Transformation`);
        }
        if (!previousUnlocks.shapeshift_lizard && marketData.highestMarketCap >= ABILITY_TARGETS.POLYJUICE_POTION.SHAPESHIFT_LIZARD.target) {
          this.unlockedAbilities.shapeshift_lizard = true;
          shouldShowToast && toast.success(`RAT_${this.id + 1} [POLYJUICE] unlocked: Lizard Transformation`);
        }
        if (!previousUnlocks.shapeshift_witcher && marketData.highestMarketCap >= ABILITY_TARGETS.POLYJUICE_POTION.SHAPESHIFT_WITCHER.target) {
          this.unlockedAbilities.shapeshift_witcher = true;
          shouldShowToast && toast.success(`RAT_${this.id + 1} [POLYJUICE] unlocked: Witcher Transformation`);
        } 
        if (!previousUnlocks.shapeshift_compound_v && marketData.highestMarketCap >= ABILITY_TARGETS.POLYJUICE_POTION.SHAPESHIFT_COMPOUND_V.target) {
          this.unlockedAbilities.shapeshift_compound_v = true;
          shouldShowToast && toast.success(`RAT_${this.id + 1} [POLYJUICE] unlocked: Compound V Transformation`); 
        }
        if (!previousUnlocks.shapeshift_titan && marketData.highestMarketCap >= ABILITY_TARGETS.POLYJUICE_POTION.SHAPESHIFT_TITAN.target) {
          this.unlockedAbilities.shapeshift_titan = true;
          shouldShowToast && toast.success(`RAT_${this.id + 1} [POLYJUICE] unlocked: Titan Transformation`);
        }
        break;
      case 'LIZARD_SERUM':
        this.size = 10 + (marketCapMultiplier * this.dosage * 1.2);
        this.scaleIntensity = Math.min(1, this.dosage / 100);
        this.tailLength = Math.min(4, this.dosage / 25);
        this.color = '#2a5c3c';
        if (!previousUnlocks.mutation && marketData.highestMarketCap >= ABILITY_TARGETS.LIZARD_SERUM.MUTATION.target) {
          this.unlockedAbilities.mutation = true;
          shouldShowToast && toast.success(`RAT_${this.id + 1} [LIZARD] unlocked: Mutation`);
        }
        if (!previousUnlocks.lizardSize && marketData.highestMarketCap >= ABILITY_TARGETS.LIZARD_SERUM.SIZE.target) {
          this.unlockedAbilities.lizardSize = true;
          shouldShowToast && toast.success(`RAT_${this.id + 1} [LIZARD] unlocked: Size Increase`);
        }
        break;
      case 'SUPER_SOLDIER_SERUM':
        if (!previousUnlocks.agility && marketData.highestMarketCap >= ABILITY_TARGETS.SUPER_SOLDIER_SERUM.AGILITY.target) {
          this.unlockedAbilities.agility = true;
          shouldShowToast && toast.success(`RAT_${this.id + 1} [SUPER SOLDIER] unlocked: Agility`);
        }
        this.size = 10 + (marketCapMultiplier * this.dosage / 2);
        
        break;
      case 'TITAN_SERUM':
        // Only apply size calculation if size ability is not unlocked
        if (!previousUnlocks.size && marketData.highestMarketCap >= ABILITY_TARGETS.TITAN_SERUM.SIZE.target) {
          this.unlockedAbilities.size = true;
          shouldShowToast && toast.success(`RAT_${this.id + 1} [TITAN] unlocked: Size Growth`);
        }
        if (!previousUnlocks.regeneration && marketData.highestMarketCap >= ABILITY_TARGETS.TITAN_SERUM.REGENERATION.target) {
          this.unlockedAbilities.regeneration = true;
          shouldShowToast && toast.success(`RAT_${this.id + 1} [TITAN] unlocked: Regeneration`);
        }
        if (!this.unlockedAbilities.size) {
          const baseSize = this.initialSize;
          const maxSize = baseSize * this.maxSizeMultiplier;
          const calculatedSize = baseSize + (marketCapMultiplier * this.dosage);
          this.size = Math.min(calculatedSize, maxSize);
        }
        break;
    }

    // The Grasses abilities
    if (this.compound === 'THE_GRASSES') {
      if (!previousUnlocks.yrden && marketData.highestMarketCap >= ABILITY_TARGETS.THE_GRASSES.YRDEN.target) {
        this.unlockedAbilities.yrden = true;
        shouldShowToast && toast.success(`RAT_${this.id + 1} [WITCHER] unlocked: Yrden Sign`);
      }
      if (!previousUnlocks.quen && marketData.highestMarketCap >= ABILITY_TARGETS.THE_GRASSES.QUEN.target) {
        this.unlockedAbilities.quen = true;
        shouldShowToast && toast.success(`RAT_${this.id + 1} [WITCHER] unlocked: Quen Sign`);
      }
      if (!previousUnlocks.axii && marketData.highestMarketCap >= ABILITY_TARGETS.THE_GRASSES.AXII.target) {
        this.unlockedAbilities.axii = true;
        shouldShowToast && toast.success(`RAT_${this.id + 1} [WITCHER] unlocked: Axii Sign`);
      }
      if (!previousUnlocks.aard && marketData.highestMarketCap >= ABILITY_TARGETS.THE_GRASSES.AARD.target) {
        this.unlockedAbilities.aard = true;
        shouldShowToast && toast.success(`RAT_${this.id + 1} [WITCHER] unlocked: Aard Sign`);
      }
    }

    this.isInitialLoad = false;
  }

  update(allRats = [], currentTime = Date.now()) {
    if (!this.active) return;

    if (this.compound === 'TITAN_SERUM' && this.unlockedAbilities.size) {
      const timeDelta = currentTime - this.lastGrowthTime;
      const maxSize = this.initialSize * this.maxSizeMultiplier;
      
      if (this.size < maxSize) {
        const growth = (this.growthRate * timeDelta / 1000);
        this.size = Math.min(this.size + growth, maxSize);
      }
      this.lastGrowthTime = currentTime;
    }

    if (this.compound === 'VENOM_SYMBIOTE' && this.isWebSlinging) {
      if (!this.webPoint) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 100;
        
        // Calculate potential web point
        const potentialX = this.position.x + Math.cos(angle) * distance;
        const potentialY = this.position.y + Math.sin(angle) * distance;
        
        // Clamp web point within safe bounds
        this.webPoint = {
          x: Math.max(SAFE_MARGIN, Math.min(CANVAS_WIDTH - SAFE_MARGIN, potentialX)),
          y: Math.max(SAFE_MARGIN, Math.min(CANVAS_HEIGHT - SAFE_MARGIN, potentialY))
        };

        // If current position is outside safe bounds, move web point inward
        if (this.position.x < SAFE_MARGIN || this.position.x > CANVAS_WIDTH - SAFE_MARGIN ||
            this.position.y < SAFE_MARGIN || this.position.y > CANVAS_HEIGHT - SAFE_MARGIN) {
          const centerX = CANVAS_WIDTH / 2;
          const centerY = CANVAS_HEIGHT / 2;
          const angleToCenter = Math.atan2(centerY - this.position.y, centerX - this.position.x);
          this.webPoint = {
            x: this.position.x + Math.cos(angleToCenter) * distance,
            y: this.position.y + Math.sin(angleToCenter) * distance
          };
        }

        // Initialize the smooth movement
        this.position.startX = this.position.x;
        this.position.startY = this.position.y;
        this.position.targetX = this.webPoint.x;
        this.position.targetY = this.webPoint.y;
        this.position.moveStartTime = Date.now();
      }

      const currentTime = Date.now();
      const elapsedTime = currentTime - this.position.moveStartTime;
      const progress = Math.min(elapsedTime / this.position.moveDuration, 1);

      // Use easeInOutQuad for smooth acceleration and deceleration
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      if (progress < 1) {
        // Interpolate position
        this.position.x = this.position.startX + (this.position.targetX - this.position.startX) * easeProgress;
        this.position.y = this.position.startY + (this.position.targetY - this.position.startY) * easeProgress;
      } else {
        // Movement complete
        this.position.x = this.position.targetX;
        this.position.y = this.position.targetY;
        this.webPoint = null;
      }

      // Update velocity for visual purposes (direction indication)
      if (this.webPoint) {
        // Calculate direction based on current position and target
        const dx = this.position.targetX - this.position.x;
        const dy = this.position.targetY - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
          const baseVelocity = 0.15;
          this.velocity.x = (dx / distance) * baseVelocity;
          this.velocity.y = (dy / distance) * baseVelocity;
        }
      }
    } else {
      // Original movement for other rats
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }

    // Keep the boundary checking
    if (this.position.x <= 0 || this.position.x >= 800) {
      if (this.compound === 'VENOM_SYMBIOTE' && this.isWebSlinging) {
        // Reset movement properties
        this.position.x = Math.max(0, Math.min(800, this.position.x));
        this.position.moveStartTime = null;
        this.position.startX = null;
        this.position.startY = null;
        this.position.targetX = null;
        this.position.targetY = null;
      }
      this.velocity.x *= -1;
      this.webPoint = null;
    }
    if (this.position.y <= 0 || this.position.y >= 600) {
      if (this.compound === 'VENOM_SYMBIOTE' && this.isWebSlinging) {
        // Reset movement properties
        this.position.y = Math.max(0, Math.min(600, this.position.y));
        this.position.moveStartTime = null;
        this.position.startX = null;
        this.position.startY = null;
        this.position.targetX = null;
        this.position.targetY = null;
      }
      this.velocity.y *= -1;
      this.webPoint = null;
    }

    if (this.compound === 'COMPOUND_V' && this.active) {
      const attackDuration = 1000; // 1 second attack duration
      
      // Check if we can attack
      if (currentTime - this.lastAttackTime > this.attackCooldown) {
        // Cycle through available attacks
        if (this.unlockedAbilities.electric && this.unlockedAbilities.fire) {
          // Both abilities unlocked - cycle through all three
          this.currentAttackType = (this.currentAttackType + 1) % 3;
        } else if (this.unlockedAbilities.electric) {
          // Only electric unlocked - alternate between laser and electric
          this.currentAttackType = this.currentAttackType === 0 ? 1 : 0;
        } else if (this.unlockedAbilities.fire) {
          // Only fire unlocked - alternate between laser and fire
          this.currentAttackType = this.currentAttackType === 0 ? 2 : 0;
        }
        
        // Start the attack
        switch(this.currentAttackType) {
          case 0: // Laser
            this.isFireingLaser = true;
            break;
          case 1: // Electric
            this.isElectricAura = true;
            this.isAuraActive = true;
            break;
          case 2: // Fire
            this.isFireAuraActive = true;
            break;
        }
        
        this.lastAttackTime = currentTime;
      } else if (currentTime - this.lastAttackTime > attackDuration) {
        // End current attack
        this.isFireingLaser = false;
        this.isElectricAura = false;
        this.isFireAuraActive = false;
        this.isAuraActive = false;
      }
    }

    if (this.compound === 'POLYJUICE_POTION' && !this.isTransformed) {
      const currentTime = Date.now();
      const transformInterval = 8000;
      
      if (!this.transformStartTime || currentTime - this.transformStartTime > transformInterval) {
        // Map compound names to their shapeshift ability names
        const compoundToAbility = {
          'VENOM_SYMBIOTE': 'shapeshift_venom',
          'SUPER_SOLDIER_SERUM': 'shapeshift_captain',
          'LIZARD_SERUM': 'shapeshift_lizard',
          'THE_GRASSES': 'shapeshift_witcher',
          'COMPOUND_V': 'shapeshift_compound_v',
          'TITAN_SERUM': 'shapeshift_titan'
        };
        
        // Find a random ACTIVE rat that has transform ability unlocked
        const availableRats = allRats.filter(r => 
          r.id !== this.id && 
          r.compound !== 'POLYJUICE_POTION' && 
          r.active && // Only target active rats
          compoundToAbility[r.compound] && // Check if compound is in our mapping
          this.unlockedAbilities[compoundToAbility[r.compound]] // Check if transformation is unlocked
        );
        
        if (availableRats.length > 0) {
          const targetRat = availableRats[Math.floor(Math.random() * availableRats.length)];
          this.transformTarget = targetRat;
          this.transformStartTime = currentTime;
          this.originalCompound = this.compound;
          this.compound = targetRat.compound;
          this.isTransformed = true;
          
          // Copy target rat's properties
          this.size = targetRat.size;
          this.speed = 1;
          this.glowIntensity = targetRat.glowIntensity;
          if (targetRat.compound === 'VENOM_SYMBIOTE') {
            this.isWebSlinging = true;
            this.tongueLength = targetRat.tongueLength;
          }
        }
      }
    }
    
    // Check if transformation should end
    if (this.isTransformed && Date.now() - this.transformStartTime > 5000) {
      // Reset to original form
      this.compound = this.originalCompound;
      this.transformTarget = null;
      this.isTransformed = false;
      this.isWebSlinging = false;
      this.tongueLength = 0;
      
      // Reset velocity to base speed
      const baseVelocity = 0.15;
      this.velocity = {
        x: (Math.random() - 0.5) * baseVelocity,
        y: (Math.random() - 0.5) * baseVelocity
      };
    }

    if (this.compound === 'SUPER_SOLDIER_SERUM') {
      const currentTime = Date.now();
      const throwInterval = 3000; // 3 seconds between throws
      
      if (!this.isThrowingShield && currentTime - this.lastShieldThrow > throwInterval) {
        this.isThrowingShield = true;
        this.lastShieldThrow = currentTime;
        this.shieldPosition = { x: this.position.x, y: this.position.y };
        this.shieldAngle = Math.random() * Math.PI * 2;
        this.shieldReturnProgress = 0;
      }
      
      if (this.isThrowingShield) {
        const throwDuration = 1500; // 1.5 seconds for complete throw and return
        const progress = (currentTime - this.lastShieldThrow) / throwDuration;
        
        if (progress <= 1) {
          // First half: shield goes out, second half: shield returns
          this.shieldReturnProgress = progress;
          const distance = 150 * Math.sin(progress * Math.PI); // Parabolic path
          
          this.shieldPosition = {
            x: this.position.x + Math.cos(this.shieldAngle) * distance,
            y: this.position.y + Math.sin(this.shieldAngle) * distance
          };
        } else {
          this.isThrowingShield = false;
          this.shieldPosition = null;
        }
      }
    }

    if (this.compound === 'THE_GRASSES') {
      const currentTime = Date.now();
      const signInterval = 4000;
      const signDuration = 2000;
      
      if (!this.isSignActive && currentTime - this.lastSignTime > signInterval) {
        // Get available signs based on unlocked abilities
        const availableSigns = [];
        if (this.unlockedAbilities.aard) availableSigns.push(0);
        if (this.unlockedAbilities.igni) availableSigns.push(1);
        if (this.unlockedAbilities.yrden) availableSigns.push(2);
        if (this.unlockedAbilities.quen) availableSigns.push(3);
        if (this.unlockedAbilities.axii) availableSigns.push(4);

        if (availableSigns.length > 0) {
          this.isSignActive = true;
          this.lastSignTime = currentTime;
          // Pick random from available signs
          this.currentSign = availableSigns[Math.floor(Math.random() * availableSigns.length)];
          this.signPosition = { x: this.position.x, y: this.position.y };
          this.signScale = 0;
          this.signRotation = 0;
        }
      }
      
      if (this.isSignActive) {
        const progress = (currentTime - this.lastSignTime) / signDuration;
        
        if (progress <= 1) {
          // Animate sign
          this.signScale = Math.min(progress * 2, 1);
          this.signRotation = progress * Math.PI * 4;
          
          // Use velocity direction instead of headAngle
          const direction = Math.atan2(this.velocity.y, this.velocity.x);
          
          switch(this.currentSign) {
            case 0: // Aard - Force push
              this.signPosition = {
                x: this.position.x + Math.cos(direction) * (100 * progress),
                y: this.position.y + Math.sin(direction) * (100 * progress)
              };
              break;
            case 1: // Igni - Fire stream
              this.signPosition = this.position;
              break;
            case 2: // Yrden - Magic trap
              this.signPosition = this.position;
              break;
            case 3: // Quen - Shield
              this.signPosition = this.position;
              break;
            case 4: // Axii - Mind control
              this.signPosition = this.position;
              break;
          }
        } else {
          this.isSignActive = false;
          this.signPosition = null;
        }
      }
    }

    // Add tongue growth logic for Venom
    if (this.compound === 'VENOM_SYMBIOTE' && this.unlockedAbilities.tongue) {
      const timeDelta = currentTime - this.lastTongueGrowthTime;
      if (this.tongueLength < this.maxTongueLength) {
        const growth = (this.tongueGrowthRate * timeDelta / 1000);
        this.tongueLength = Math.min(this.tongueLength + growth, this.maxTongueLength);
      }
      this.lastTongueGrowthTime = currentTime;
    }
  }
} 
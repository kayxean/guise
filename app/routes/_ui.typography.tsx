import type { MetaFunction } from '@remix-run/node';
import { Article, Section } from '~/components/semantic';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Typography' },
		{ name: 'description', content: 'guise' },
		{ tagName: 'link', rel: 'canonical', href: '/typography' },
	];
};

export default function Typography() {
	return (
		<Article>
			<Section>
				<h1>Understanding Guise</h1>
				<p>
					The word <em>"guise"</em> refers to an external appearance, often
					adopted in order to conceal the true nature of something or someone.
				</p>
				<p>
					It suggests a deceptive or misleading outward show. Think of it as a{' '}
					<strong>costume</strong> or a <strong>disguise</strong> that an entity
					wears.
				</p>
				<p>
					It can be used in various contexts, from literature to everyday
					conversation. For instance, a villain might appear in the guise of a
					friendly stranger.
				</p>
			</Section>
			<Section>
				<h2>Key Aspects and Usage</h2>
				<blockquote>
					<p>
						<strong>Guise:</strong> an external form, appearance, or manner of
						presentation, typically concealing the true nature of something.
					</p>
					<footer>
						— Oxford English Dictionary (conceptual interpretation)
					</footer>
				</blockquote>
				<p>Common uses often involve:</p>
				<ul>
					<li>
						<strong>Concealment:</strong> Hiding intentions or identity.
					</li>
					<li>
						<strong>Deception:</strong> Misleading others about one's true
						purpose.
					</li>
					<li>
						<strong>Appearance vs. Reality:</strong> Highlighting a contrast
						between what seems to be and what actually is.
					</li>
				</ul>
				<h3>Examples in Sentences</h3>
				<ol>
					<li>The spy entered the country in the guise of a tourist.</li>
					<li>Under the guise of friendship, he betrayed his allies.</li>
					<li>
						The software virus often appears in the guise of a helpful utility.
						<ul>
							<li>This is a common tactic for malware.</li>
							<li>It makes users unsuspecting.</li>
						</ul>
					</li>
				</ol>
			</Section>
			<Section>
				<h2>Technical Analogy</h2>
				<p>
					In programming, one might metaphorically think of an interface or an
					abstract class as defining a "guise" that concrete implementations
					must adhere to, even if their internal workings differ.
				</p>
				<pre>
					<code>{`interface Animal {
makeSound(): string;
eat(): void;
}

class Dog implements Animal {
makeSound() {
  return "Woof!"; // The "dog" guise
}
eat() {
  console.log("Eating kibble.");
}
}

class Cat implements Animal {
makeSound() {
  return "Meow!"; // The "cat" guise
}
eat() {
  console.log("Eating fish.");
}
}

function interactWithAnimal(animal: Animal) {
console.log(animal.makeSound()); // Interacting with the "Animal" guise
animal.eat();
}

const myDog = new Dog();
const myCat = new Cat();

interactWithAnimal(myDog); // Output: Woof! \\n Eating kibble.
interactWithAnimal(myCat); // Output: Meow! \\n Eating fish.
`}</code>
				</pre>
				<p>
					Here, <code>Animal</code> provides a common "guise" (interface) for
					different creatures.
				</p>
			</Section>
			<Section>
				<h2>The Aesthetic Guise of Software</h2>
				<p>
					In software development, "guise" refers to the deliberate external
					appearance and presentation of an application or system.
				</p>
				<p>
					It encompasses all visual and interactive elements that shape how a
					user perceives and interacts with the software.
				</p>
				<p>
					This is the intentional 'face' your software presents, distinct from
					its underlying functionality.
				</p>
				<h3>Defining Software's External Presentation</h3>
				<p>Consider the various ways software can manifest its "guise":</p>
				<ul>
					<li>
						The meticulously chosen color palette of your Integrated Development
						Environment (IDE).
					</li>
					<li>A custom font applied to your terminal interface.</li>
					<li>A seamless dark mode theme for late-night coding sessions.</li>
					<li>
						The overall design language and user interface of a web application.
					</li>
				</ul>
				<p>
					These elements collectively form the outward show, or "guise" of the
					software, influencing user experience and brand perception.
				</p>
				<h3>Functionality vs. Appearance</h3>
				<p>
					The software's guise is how its core functionality is packaged and
					perceived. For example, a sleek, minimalist Command Line Interface
					(CLI) tool might conceal highly complex algorithms beneath a simple
					facade.
				</p>
				<p>
					Similarly, a beautifully rendered dashboard presents data streams in
					an aesthetically pleasing and easily digestible format, rather than
					exposing raw information.
				</p>
				<p>
					Both deliver information, but the latter does so with a designed and
					impactful aesthetic that shapes user understanding and engagement.
				</p>
				<h3>Crafting the Intentional Look</h3>
				<p>
					When you adjust CSS variables, install custom icon packs, or
					meticulously arrange your dotfiles, you are actively crafting the
					software's aesthetic guise.
				</p>
				<p>
					These actions go beyond simple styling; they involve making deliberate
					design choices that tell a story, evoke a specific feeling, and
					influence how the software truly *appears* to the user.
				</p>
				<p>
					This process often involves obscuring the technical complexities or
					"bare metal" underneath with a layer of intentional design and
					personal flair, creating a distinct user impression.
				</p>
			</Section>
		</Article>
	);
}
